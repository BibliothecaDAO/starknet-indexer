import {
    StreamClient,
} from '@apibara/protocol'
// import {
//     Filter
// } from '@apibara/starknet'
import { Context } from "../context";

export class TransferStreamClient {
    protected context: Context;
    protected addresses: string[];

    // private readonly address: any;
    // private readonly transferKey: any[];
    private readonly filter: Uint8Array;
    public readonly client: StreamClient;


    constructor(context: Context) {
        this.context = context;
        // this.address = address;
        // this.transferKey = transferKey;
        // this.filter = this.createFilter();
        this.client = new StreamClient({
            url: 'testnet.starknet.a5a.ch',
            clientOptions: { 'grpc.max_receive_message_length': 128 * 1_048_576 },
        });
        // this.addresses = [address];

        console.log(this.filter)
    }

    // public createFilter(): Uint8Array {
    //     const filter = Filter.create()
    //         .addEvent((ev) =>
    //             ev.withFromAddress(this.address).withKeys(this.transferKey)
    //         )
    //         .withStateUpdate((su) =>
    //             su.addStorageDiff((st) => st.withContractAddress(this.address))
    //         )
    //         .encode();
    //     return filter;
    // }

    public async start(): Promise<void> {
        for await (const message of this.client) {
            if (message.data?.data) {
                // handle data
            }
        }
    }

    contracts(): string[] {
        return this.addresses;
    }

    // async index(events: Event[]): Promise<void> {
    //     try {
    //         for (const event of events) {
    //             const eventId = event.eventId;
    //             const handlerObject = this.handlers[selectorHash(event.keys[0])];
    //             const updates = [];
    //             if (handlerObject) {
    //                 updates.push(handlerObject.handle(event));
    //             }
    //             updates.push(
    //                 await this.context.prisma.event.updateMany({
    //                     where: { eventId },
    //                     data: { status: 2 },
    //                 })
    //             );
    //             await Promise.all(updates);
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }

    //     return;
    // }

    // async lastEventId(): Promise<string> {
    //     const event = await this.context.prisma.event.findFirst({
    //         where: {
    //             contract: { in: this.contracts() },
    //             status: 2,
    //         },
    //         orderBy: {
    //             eventId: "desc",
    //         },
    //     });
    //     return event?.eventId ?? "";
    // }

    // async lastBlockNumber(): Promise<number> {
    //     const event = await this.context.prisma.event.findFirst({
    //         where: {
    //             contract: { in: this.contracts() },
    //             status: 2,
    //         },
    //         orderBy: {
    //             eventId: "desc",
    //         },
    //     });
    //     return event?.blockNumber ?? 0;
    // }

    // async saveRealmHistory({
    //     realmId,
    //     eventId,
    //     eventType,
    //     data,
    //     timestamp,
    //     transactionHash,
    // }: RealmEvent): Promise<void> {
    //     const realm = await this.context.prisma.realm.findFirst({
    //         where: { realmId },
    //     });
    //     const realmOwner = realm?.settledOwner || realm?.ownerL2 || "";
    //     const realmName = realm?.name ?? "";
    //     const realmOrder = (realm?.orderType as OrderType) ?? undefined;

    //     await this.context.prisma.realmHistory.upsert({
    //         where: {
    //             eventId_eventType: { eventId: eventId, eventType: eventType },
    //         },
    //         update: { realmId, data, timestamp, realmOwner, realmName, realmOrder },
    //         create: {
    //             eventId,
    //             eventType,
    //             realmId,
    //             realmOwner,
    //             realmName,
    //             realmOrder,
    //             data,
    //             timestamp,
    //             transactionHash,
    //         },
    //     });
    // }
}