import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import { Realm } from "@prisma/client";
import bastions from '../../db/bastionsGeoData.json'


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

    // related to a bastionid if travel from or to a bastion
    let bastionId: number | undefined;
    if (destinationContractId === 17) {
      bastionId = destinationTokenId;
    } else if (locationContractId === 17) {
      bastionId = locationTokenId;
    } 
    const [latitude, longitude] = getCoordinatesForBastion(bastionId);

    // Entering Bastion
    if (bastionId && destinationContractId === 17) {
      try {
        await Promise.allSettled([
          // need to create bastion here because this first interaction with it (travel to bastion)
          this.context.prisma.bastion.upsert({
            where: { bastionId },
            update: { longitude, latitude },
            create: { bastionId, longitude, latitude },
          }),
          this.context.prisma.bastionLocation.upsert({
            where: {
              bastionId_locationId: {
                bastionId: destinationTokenId,
                locationId: 0,
              },
            },
            update: {},
            create: {
              bastionId: destinationTokenId,
              locationId: 0,
            },
          }),
          this.context.prisma.army.update({
            where: { realmId_armyId: { realmId: tokenId, armyId: nestedId } },
            data: {
              bastionId: destinationTokenId,
              bastionPastLocation: 0,
              bastionCurrentLocation: 0,
              bastionArrivalBlock: 0,
              destinationArrivalTime,
            },
          }),
        ]);
      } catch (e) {}
    } else {
      try {
        await this.context.prisma.army.update({
          where: { realmId_armyId: { realmId: tokenId, armyId: nestedId } },
          data: {
            destinationRealmId: destinationTokenId,
            destinationArrivalTime,
            bastionId: 0,
            bastionPastLocation: 0,
            bastionCurrentLocation: 0,
            bastionArrivalBlock: 0,
          },
        });
      } catch (e) {}
    }
    try {
      await this.context.prisma.travel.upsert({
          where: { eventId },
          create: { ...updates, eventId },
          update: { ...updates },
        })
      const realmHistory = await this.saveRealmHistory({
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
            locationContractId,
            locationRealmId: locationRealm?.realmId,
            locationRealmOwner: getRealmAccount(locationRealm),
            destinationContractId,
            destinationRealmId: destinationTokenId,
            destinationRealmOwner: getRealmAccount(destinationRealm),
            destinationArrivalTime: new Date(destinationArrivalTime).getTime(),
          },
        })
      if (bastionId) {
          this.saveBastionHistory({bastionId, realmHistoryEventId: realmHistory.eventId, realmHistoryEventType: realmHistory.eventType})
      }
    } catch (e) {}
  }
}

function getRealmAccount(realm: Realm | undefined) {
  return realm?.settledOwner || realm?.ownerL2 || "";
}

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}


const getCoordinatesForBastion = (bastionId: number | undefined): [number | undefined, number | undefined] => {
  const bastion = bastions.find((bastion) => bastion.id === bastionId);
  let latitude: number | undefined;
  let longitude: number | undefined;
  if (bastion) {
    latitude = bastion?.xy[1] * 10000 + 1800000;
    longitude = bastion?.xy[0] * 10000 + 1800000;
  }
  return [latitude, longitude];
};