import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";

export const CONTRACT =
  "0x05db01dca6c5986b10b079b39b44ac312eb213d8081a29d83556cf93f98a0872";

const START_BLOCK = 241365;

export default class SettlingIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("ClaimTime", this.claimTime.bind(this));
    this.on("VaultTime", this.vaultTime.bind(this));
    this.on("Settled", this.settled.bind(this));
    this.on("UnSettled", this.unsettled.bind(this));
  }

  async settled(): Promise<void> {}
  async unsettled(): Promise<void> {}

  async claimTime(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);

    if (event.blockNumber < START_BLOCK) {
      return;
    }

    if (!realmId || realmId > 8000) {
      // TODO: update when realm count increases
      console.log("Unknown Realm", event.txHash);
      return;
    }

    const timestamp = new Date(parseInt(params[2]) * 1000);
    await this.context.prisma.realm.update({
      where: { realmId },
      data: { lastClaimTime: timestamp },
    });
  }

  async vaultTime(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const realmId = parseInt(params[0]);

    if (event.blockNumber < START_BLOCK) {
      return;
    }

    if (!realmId || realmId > 8000) {
      // TODO: update when realm count increases
      console.log("Unknown Realm", event.txHash);
      return;
    }

    const timestamp = new Date(parseInt(params[2]) * 1000);
    await this.context.prisma.realm.update({
      where: { realmId },
      data: { lastVaultTime: timestamp },
    });
  }
}
