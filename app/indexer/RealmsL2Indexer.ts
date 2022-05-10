import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";

const SETTLING_CONTRACT_ADDRESS =
  "0x07416e6b5d7470a75ffe1eb7a3b6aa6174a4bec2d8598cddfc3a9c7d2d9457bc";

const TRANSFER_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("Transfer")
).toHexString();
const APPROVAL_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("Approval")
).toHexString();

export default class RealmsL2Indexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x04bf47377bbab7b259161f59631bfb8942813740c892b5c3761fb3232cbb0c5c"
  ];
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    return this.CONTRACTS;
  }

  isTransferEvent(keys: string[]) {
    if (keys?.length !== 1) {
      return false;
    }
    return BigNumber.from(keys[0]).toHexString() === TRANSFER_SELECTOR;
  }

  isSettlingContract(address: string) {
    return SETTLING_CONTRACT_ADDRESS === address;
  }

  eventName(selector: string): string {
    const eventSelector = BigNumber.from(selector).toHexString();
    switch (eventSelector) {
      case TRANSFER_SELECTOR:
        return "Transfer";
      case APPROVAL_SELECTOR:
        return "Approval";
      default:
        return "";
    }
  }

  async index(events: Event[]): Promise<void> {
    let lastIndexedEventId = await this.lastIndexId();
    for (const event of events) {
      const eventId = event.eventId;
      if (eventId <= lastIndexedEventId) {
        continue;
      }
      const params = event.parameters ?? [];
      const keys = event.keys ?? [];
      if (this.isTransferEvent(keys)) {
        const where = {
          realmId: parseInt(params[2])
        };
        const fromAddress = BigNumber.from(params[0]).toHexString();
        const toAddress = BigNumber.from(params[1]).toHexString();

        //ensure wallet is created
        await this.context.prisma.wallet.upsert({
          where: { address: toAddress },
          update: { address: toAddress },
          create: { address: toAddress }
        });

        if (this.isSettlingContract(toAddress)) {
          await this.context.prisma.realm.update({
            data: { ownerL2: toAddress, settledOwner: fromAddress },
            where
          });
        } else {
          await this.context.prisma.realm.update({
            data: { ownerL2: toAddress, settledOwner: null },
            where
          });
        }
      }
    }
    return;
  }

  async lastIndexId(): Promise<string> {
    const event = await this.context.prisma.event.findFirst({
      where: {
        contract: { in: this.contracts() },
        status: 2
      },
      orderBy: {
        eventId: "desc"
      }
    });
    return event?.eventId ?? "";
  }
}
