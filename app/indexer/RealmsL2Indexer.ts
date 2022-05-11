import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";

const SETTLING_CONTRACT_ADDRESS =
  "0x007235420ad11fa85b9e9837fb03a0b42a56cc930dd51a9aadbb5ad229eabe77";

const TRANSFER_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("Transfer")
).toHexString();
const APPROVAL_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("Approval")
).toHexString();

export default class RealmsL2Indexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x0741568eef7e69072fac5ac490ef2dca278fe75898814326fc37b0c6b36e94e0"
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
