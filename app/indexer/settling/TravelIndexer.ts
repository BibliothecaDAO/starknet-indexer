import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import { Realm } from "@prisma/client";

const CONTRACT =
  "0x0593c3cf5559886c7243107581f0a67c083128c04532c51e75c74eafa78a0479";

export default class TravelIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("TravelAction_2", this.travelAction.bind(this));
  }

  async travelAction(event: Event): Promise<void> {
    const eventId = event.eventId as string;
    const params = event.parameters ?? [];
    const contractId = +params[0];
    const tokenId = arrayUInt256ToNumber(params.slice(1, 3)) as number;
    const nestedId = +params[3];

    const locationContractId = +params[4];
    const locationTokenId = arrayUInt256ToNumber(params.slice(5, 7)) as number;
    const locationNestedId = +params[7];

    const destinationContractId = +params[8];
    const destinationTokenId = arrayUInt256ToNumber(
      params.slice(9, 11)
    ) as number;
    const destinationNestedId = +params[11];
    const destinationArrivalTime = new Date(+params[12] * 1000);

    const updates = {
      contractId,
      tokenId,
      nestedId,
      locationContractId,
      locationTokenId,
      locationNestedId,
      destinationContractId,
      destinationTokenId,
      destinationNestedId,
      destinationArrivalTime,
      timestamp: event.timestamp,
    };

    const realmIds = [tokenId, locationTokenId, destinationTokenId];
    const realms = await this.context.prisma.realm.findMany({
      where: { realmId: { in: realmIds } },
    });
    const originRealm = realms.find((realm) => realm.realmId === tokenId);
    const locationRealm =
      locationTokenId === 0
        ? originRealm
        : realms.find((realm) => realm.realmId === locationTokenId);
    const destinationRealm = realms.find(
      (realm) => realm.realmId === destinationTokenId
    );

    await Promise.all([
      this.context.prisma.travel.upsert({
        where: { eventId },
        create: { ...updates, eventId },
        update: { ...updates },
      }),

      this.saveRealmHistory({
        realmId: tokenId,
        eventId,
        account: getRealmAccount(originRealm),
        eventType: "army_travel",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          originRealmId: tokenId,
          originRealmOwner: getRealmAccount(originRealm),
          originArmyId: nestedId,
          locationRealmId: locationRealm?.realmId,
          locationRealmOwner: getRealmAccount(locationRealm),
          destinationRealmId: destinationTokenId,
          destinationRealmOwner: getRealmAccount(destinationRealm),
          destinationArrivalTime: new Date(destinationArrivalTime).getTime(),
        },
      }),
    ]);

    try {
      await this.context.prisma.army.update({
        where: { realmId_armyId: { realmId: tokenId, armyId: nestedId } },
        data: {
          destinationRealmId: destinationTokenId,
          destinationArrivalTime,
        },
      });
    } catch (e) {}
  }
}

function getRealmAccount(realm: Realm | undefined) {
  return realm?.settledOwner || realm?.ownerL2 || "";
}

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}
