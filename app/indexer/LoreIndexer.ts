import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Contract, Provider } from "starknet";
import { uint256ToBN } from "starknet/utils/uint256";
import fetch from "node-fetch";
import LoreABI from "../abis/Lore.json";
import BaseContractIndexer from "./BaseContractIndexer";

const CONTRACT =
  "0x06894a6766b4763d8bea8d43f433d25e577ed8bf057942c861df4e9951282c64";

export default class LoreIndexer extends BaseContractIndexer {
  private provider: Provider = new Provider({
    network: process.env.NETWORK === "goerli" ? "goerli-alpha" : "mainnet-alpha"
  });
  private contract: Contract = new Contract(
    LoreABI as any,
    CONTRACT,
    this.provider
  );

  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("entity_created", this.entityCreated.bind(this));
  }

  async wait(milliseconds: number) {
    return new Promise((resolve, _) => {
      setTimeout(resolve, milliseconds);
    });
  }

  async entityCreated(event: Event): Promise<void> {
    console.log(event);

    const params = event.parameters ?? [];
    const entityId = parseInt(params[0]);

    let entity;
    try {
      entity = await this.contract.get_entity(
        entityId.toString(), // entity_id
        "1" // revision_id
      );
    } catch (error) {
      console.log(error);

      return;
    }

    // console.log(entityId)
    // console.log(entity);

    const part1 = Buffer.from(
      entity.content.Part1.toString(16),
      "hex"
    ).toString();
    const part2 = Buffer.from(
      entity.content.Part2.toString(16),
      "hex"
    ).toString();

    const arweaveId = `${part1}${part2}`;

    let arweaveJSON: any;

    try {
      const response = await fetch(`https://arweave.net/${arweaveId}`, {
        timeout: 20000
      });

      arweaveJSON = await response.json();
    } catch (error) {
      console.log(error);
      // await this.wait(6000);
      // await this.createEntity(entityId);
      return;
    }

    try {
      await this.context.prisma.loreEntity.upsert({
        where: {
          id: entityId
        },
        create: {
          id: entityId,
          owner: entity.owner.toString(),
          kind: entity.kind.toNumber(),
          eventIndexed: event.eventId
        },
        update: {
          owner: entity.owner.toString(),
          kind: entity.kind.toNumber(),
          eventIndexed: event.eventId
        }
      });

      const data: any = {
        entityId,
        revisionNumber: 1,
        arweaveId,
        title: arweaveJSON.title,
        markdown: arweaveJSON.markdown
      };

      if (entity.pois.length > 0) {
        data.pois = {
          create: entity.pois.map((poi: any) => ({
            poiId: poi.id.toNumber(),
            assetId: poi.asset_id ? uint256ToBN(poi.asset_id).toString() : null
          }))
        };
      }

      if (entity.props.length > 0) {
        data.props = {
          create: entity.props.map((prop: any) => ({
            propId: prop.id.toNumber(),
            value: prop.value.toString()
          }))
        };
      }

      // Temporary while testing only 1 revision
      const firstRevision =
        await this.context.prisma.loreEntityRevision.findFirst({
          where: {
            entityId,
            revisionNumber: 1
          }
        });

      // Omit pois and props
      // const { pois, props, ...updateData } = data;

      await this.context.prisma.loreEntityRevision.upsert({
        where: {
          id: firstRevision ? firstRevision.id : -1
        },
        create: data,
        update: data
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // async lastIndexId(): Promise<string> {
  //   const lastRevision = await this.context.prisma.loreEntity.findFirst({
  //     orderBy: {
  //       eventIndexed: "desc"
  //     }
  //   });

  //   return lastRevision?.eventIndexed ?? "0";
  // }
}
