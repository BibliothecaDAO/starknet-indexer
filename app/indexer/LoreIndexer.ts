// import { DesiegeResolver } from "../resolvers";
import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { Contract } from 'starknet'
import { uint256ToBN } from 'starknet/utils/uint256'
import https from 'https'
// import bl from 'bl'

import LoreABI from '../abis/Lore.json'

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

      await this.context.prisma.lastIndexedEvent.upsert({
        where: {
          moduleName: 'lore',
        },
        update: {
          eventId
        },
        create: {
          moduleName: 'lore',
          eventId
        }
      });
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

    console.log(entityId)
    console.log(entity)
    
    const part1 = Buffer.from(entity.content.Part1.toString(16), "hex").toString();
    const part2 = Buffer.from(entity.content.Part2.toString(16), "hex").toString();

    const arweaveId = `${part1}${part2}`;

    let arweaveJSON: any;

    try {
      const arweaveContent: string = await new Promise((resolve, reject) => {
        // Example: https://arweave.net/3llbQLws5iw9v1O6T_8vxsvDRYqfehZ038ef7vCQ15Q
        https.get(`https://arweave.net/${arweaveId}`, response => {
          response.setEncoding('utf8');
          const data: any = [];
          response.on('data', (chunk) => {
            data.push(chunk);
          }).on('end', () => {
            resolve(data.join().toString()); // JSON
          });
        }).on('error', error => reject(error));
      });

      arweaveJSON = JSON.parse(arweaveContent)
    } catch (error) {
      console.log(error);
      await this.wait(6000);
      await this.createEntity(entityId);
      return;
    }

    console.log(arweaveJSON)

    try {
      const dbEntity = await this.context.prisma.loreEntity.create({
        data: {
          id: entityId,
          owner: entity.owner.toString(),
          kind: entity.kind.toNumber()
        },
      });

      await this.context.prisma.loreEntityRevision.create({
        data: {
          entityId: dbEntity.id,
          revisionNumber: 0,
          arweaveId,
          title: arweaveJSON.title,
          markdown: arweaveJSON.markdown,
          pois: {
            create: [
              entity.pois.map((poi: any) => ({ poiId: poi.id.toNumber(), assetId: poi.asset_id ? uint256ToBN(poi.asset_id).toString() : null }))
            ]
          },
          props: {
            create: [
              entity.props.map((prop: any) => ({ propId: prop.id.toNumber(), value: prop.value.toNumber() }))
            ]
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  async lastIndexId(): Promise<string> {
    const lastIndexedEvent = await this.context.prisma.lastIndexedEvent.findFirst({
      where: {
        moduleName: 'lore',
      }
    });

    return lastIndexedEvent?.eventId ?? "0";
  }
}
