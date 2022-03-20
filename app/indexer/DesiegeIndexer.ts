import { DesiegeResolver } from "../resolvers";
import { Context } from "../context";
import { Indexer, StarkNetEvent } from "./../types";

export default class DesiegeIndexer implements Indexer {
  private contracts = [
    "0x40098a0012c879cf85e0909ca10108197d9bf3970e6c2188641697f49aca134",
    "0x1fbec91116c1ced6bb392502adc191dd7978f2b066c674bf28f8710a9a52afd"
  ];
  private startBlock = 6000; // Start Block
  private context: Context;
  private resolver: DesiegeResolver;

  constructor(context: Context) {
    this.context = context;
    this.resolver = new DesiegeResolver();
  }

  getContracts(): string[] {
    return this.contracts;
  }

  async updateIndex(events: StarkNetEvent[]): Promise<void> {
    let lastIndexedBlock = await this.getLastBlockIndexed();
    for (const event of events) {
      const blockIndex = event.block_number;
      if (blockIndex <= lastIndexedBlock) {
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
      lastIndexedBlock = blockIndex;
    }
    return;
  }

  async getLastBlockIndexed(): Promise<number> {
    const desiege = await this.context.prisma.desiege.findFirst({
      orderBy: {
        blockIndexed: "desc"
      }
    });
    if (desiege) {
      return desiege.blockIndexed;
    }
    return this.startBlock;
  }
}
