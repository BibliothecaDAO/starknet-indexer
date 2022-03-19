import { DesiegeResolver } from "../resolvers";
import { Context } from "../context";
import { Indexer, StarkNetEvent } from "./../types";

export default class DesiegeIndexer implements Indexer {
  readonly contract =
    process.env.DESIEGE_CONTRACT ??
    "0x40098a0012c879cf85e0909ca10108197d9bf3970e6c2188641697f49aca134";
  private lastIndexedBlock = 6000; // Start Block
  private context: Context;
  private resolver: DesiegeResolver;

  constructor(context: Context) {
    this.context = context;
    this.resolver = new DesiegeResolver();
  }

  async init(): Promise<void> {
    const desiege = await this.context.prisma.desiege.findFirst({
      orderBy: {
        blockIndexed: "desc"
      }
    });
    if (desiege) {
      this.lastIndexedBlock = desiege.blockIndexed;
    }
    return;
  }

  async updateIndex(events: StarkNetEvent[]): Promise<void> {
    for (const event of events) {
      const blockIndex = event.block_number;
      if (blockIndex < this.lastIndexedBlock) {
        continue;
      }
      const parameters = event.parameters ?? [];

      const param = (name: string) =>
        Number(parameters.find((a) => a.name === name)?.value!) || 0;

      const tokenOffset = param("token_offset");
      const tokenAmount = param("amount");

      await this.resolver.createOrUpdateDesiege(
        {
          gameId: param("game_idx"),
          winner: 0,
          attackedTokens: tokenOffset === 1 ? tokenAmount : 0,
          defendedTokens: tokenOffset === 2 ? tokenAmount : 0,
          blockIndexed: event.block_number
        },
        this.context
      );
      this.lastIndexedBlock = blockIndex;
    }
    return;
  }

  getLastBlockIndexed(): number {
    return this.lastIndexedBlock;
  }
}
