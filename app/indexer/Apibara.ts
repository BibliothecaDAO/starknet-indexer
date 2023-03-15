import { Event } from "./../entities/starknet/Event";
import { Context } from "./../context";
import { Indexer, RealmEvent } from "./../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";
import { OrderType } from "@prisma/client";
import {
    StreamClient,
} from '@apibara/protocol'

type ContractEventHandler = {
    name: string;
    handle: (event: Event) => Promise<boolean>;
};

function selectorHash(selector: string) {
    return BigNumber.from(selector).toHexString();
}

export default class ApibaraBaseContractIndexer implements Indexer<Event> {
    protected context: Context;
    protected addresses: string[];
    private handlers: { [select: string]: ContractEventHandler };

    public readonly client: StreamClient;
    public filter: any;

    constructor(context: Context, address: string, filter: any) {
        this.context = context;
        this.handlers = {};
        this.addresses = [address];
        this.filter = filter;

        this.client = new StreamClient({
            url: 'goerli.starknet.a5a.ch:443'
        });

        // set filter
        this.filterConfig();
    }

    // public async start(): Promise<void> {
    //     for await (const message of this.client) {
    //         if (message.data?.data) {
    //             // handle data
    //         }
    //     }
    // }

    async filterConfig() {
        await this.client.configure({
            filter: this.filter,
            batchSize: 1,
            finality: 1
        })
    }

    contracts(): string[] {
        return this.addresses;
    }

    on(name: string, handle: (event: Event) => Promise<boolean>) {
        this.handlers[selectorHash(hash.getSelectorFromName(name))] = {
            name,
            handle,
        };
    }

    eventName(selector: string): string {
        return this.handlers[selectorHash(selector)]?.name ?? "";
    }

    async index(events: Event[]): Promise<void> {
        try {
            for (const event of events) {
                const eventId = event.eventId;
                const handlerObject = this.handlers[selectorHash(event.keys[0])];
                const updates = [];
                if (handlerObject) {
                    updates.push(handlerObject.handle(event));
                }
                updates.push(
                    await this.context.prisma.event.updateMany({
                        where: { eventId },
                        data: { status: 2 },
                    })
                );
                await Promise.all(updates);
            }
        } catch (e) {
            console.error(e);
        }

        return;
    }

    async lastEventId(): Promise<string> {
        const event = await this.context.prisma.event.findFirst({
            where: {
                contract: { in: this.contracts() },
                status: 2,
            },
            orderBy: {
                eventId: "desc",
            },
        });
        return event?.eventId ?? "";
    }

    async lastBlockNumber(): Promise<number> {
        const event = await this.context.prisma.event.findFirst({
            where: {
                contract: { in: this.contracts() },
                status: 2,
            },
            orderBy: {
                eventId: "desc",
            },
        });
        return event?.blockNumber ?? 0;
    }

    async saveRealmHistory({
        realmId,
        eventId,
        eventType,
        data,
        timestamp,
        transactionHash,
    }: RealmEvent): Promise<void> {
        const realm = await this.context.prisma.realm.findFirst({
            where: { realmId },
        });
        const realmOwner = realm?.settledOwner || realm?.ownerL2 || "";
        const realmName = realm?.name ?? "";
        const realmOrder = (realm?.orderType as OrderType) ?? undefined;

        await this.context.prisma.realmHistory.upsert({
            where: {
                eventId_eventType: { eventId: eventId, eventType: eventType },
            },
            update: { realmId, data, timestamp, realmOwner, realmName, realmOrder },
            create: {
                eventId,
                eventType,
                realmId,
                realmOwner,
                realmName,
                realmOrder,
                data,
                timestamp,
                transactionHash,
            },
        });
    }
}
