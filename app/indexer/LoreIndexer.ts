// import { DesiegeResolver } from "../resolvers";
import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { Contract } from 'starknet'
import { uint256ToBN } from 'starknet/utils/uint256'
import fetch from "node-fetch";

import LoreABI from '../abis/Lore.json'
import { toBN } from "starknet/utils/number";

export default class LoreIndexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x521151a3e28d2efff7d7d34c4f8bbe45c4c9f37424bae4dc63836fd659c51e6"
  ];
  // @ts-ignore
  private context: Context;
  private contract: Contract = new Contract(LoreABI as any, this.CONTRACTS[0]);

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    // this.createEntity(1)

    return this.CONTRACTS;
  }

  async index(events: Event[]): Promise<void> {
    let lastIndexedEventId = await this.lastIndexId();

    for (const event of events) {
      const eventId = event.eventId;
      if (eventId <= lastIndexedEventId) {
        continue;
      }

      const params: number[] = (event.parameters as number[]) ?? [];

      await this.createEntity(params[0]);
    }
    return;
  }

  async wait(milliseconds: number) {
    return new Promise((resolve, _) => {
      setTimeout(resolve, milliseconds);
    });
  }

  async createEntity(entityId: number) {
    const entity = await this.contract.get_entity(
      entityId.toString(), // entity_id
      "0", // revision_id
    )

    // console.log(entityId)
    // console.log(entity)
    
    const part1 = Buffer.from(entity.content.Part1.toString(16), "hex").toString();
    const part2 = Buffer.from(entity.content.Part2.toString(16), "hex").toString();

    const arweaveId = `${part1}${part2}`;

    let arweaveJSON: any;

    try {
      const response = await fetch(`https://arweave.net/${arweaveId}`, { timeout: 20000 });
      arweaveJSON = await response.json();
    } catch (error) {
      console.log(error);
      // await this.wait(6000);
      // await this.createEntity(entityId);
      return;
    }

    // console.log(arweaveJSON)

    try {
      await this.context.prisma.loreEntity.upsert({
        where: {
          id: entityId,
        },
        create: {
          id: entityId,
          owner: entity.owner.toString(),
          kind: entity.kind.toNumber()
        },
        update: {
          owner: entity.owner.toString(),
          kind: entity.kind.toNumber()
        },
      });

      const data: any = {
        entityId,
        revisionNumber: 0,
        arweaveId,
        title: arweaveJSON.title,
        markdown: arweaveJSON.markdown,
      }

      if (entity.pois.length > 0) {
        data.pois = {
          create: entity.pois.map((poi: any) => ({ poiId: poi.id.toNumber(), assetId: poi.asset_id ? uint256ToBN(poi.asset_id).toString() : null }))
        }
      }

      if (entity.props.length > 0 && (entity.props[0].id)) {
        // StarkNet cannot return empty arrays? 
        if (!entity.props[0].id.eq(toBN(0)) && !entity.props[0].value.eq(toBN(0))) {
          data.props = {
            create: entity.props.map((prop: any) => ({ propId: prop.id.toNumber(), value: prop.value.toNumber() }))
          }
        }
      }

      // Temporary while testing only 1 revision
      const firstRevision = await this.context.prisma.loreEntityRevision.findFirst({
        where: {
          entityId,
          revisionNumber: 0
        }
      })

      // Omit pois and props
      const { pois, props, ...updateData } = data; 

      await this.context.prisma.loreEntityRevision.upsert({
        where: {
          id: firstRevision ? firstRevision.id : -1
        },
        create: data,
        update: updateData
      });
    } catch (error) {
      console.log(error)
      return false
    }

    return;
  }

  async lastIndexId(): Promise<string> {
    const lastRevision = await this.context.prisma.loreEntity.findFirst({
      orderBy: {
        eventIndexed: "desc"
      }
    });

    return lastRevision?.eventIndexed ?? "0";
  }
}
