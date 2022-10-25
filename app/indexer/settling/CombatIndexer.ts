import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import {
  COMBAT_OUTCOME_ATTACKER_WINS,
  ResourceNameById
} from "../../utils/game_constants";

const CONTRACT =
  "0x039f40b33de4d22b2c140fccbcf2092ccc24ebdb7ed985716b93f763ae5607e8";

const START_BLOCK = 331146;
const ARMY_SEELCT = {
  realmId: true,
  armyId: true,
  lightCavalryQty: true,
  lightCavalryHealth: true,
  heavyCavalryQty: true,
  heavyCavalryHealth: true,
  archerQty: true,
  archerHealth: true,
  longbowQty: true,
  longbowHealth: true,
  mageQty: true,
  mageHealth: true,
  arcanistQty: true,
  arcanistHealth: true,
  lightInfantryQty: true,
  lightInfantryHealth: true,
  heavyInfantryQty: true,
  heavyInfantryHealth: true
};

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}

export const BATTALION_LENGTH = 8;
export const BATTALION_ATTR_LENGTH = 2;

export default class CombatIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("BuildArmy", this.buildArmy.bind(this));
    this.on("ArmyMetadata", this.updateArmyMetadata.bind(this));
    this.on("CombatStart_4", this.combatStart.bind(this));
    this.on("CombatEnd_4", this.combatEnd.bind(this));
  }

  async buildArmy(event: Event) {
    const params = event.parameters ?? [];
    await this.updateArmy(params, false);
  }

  async updateArmyMetadata(event: Event) {
    const params = event.parameters ?? [];
    const armyId = +params[0];
    const realmId = arrayUInt256ToNumber(params.slice(1, 3));

    // Ignore Army data for now
    // const armyPacked = 0; //+params[3];
    const lastAttacked = +params[4] ? new Date(+params[4] * 1000) : null;
    const level = +params[5];
    const callSign = +params[6];

    const updates = {
      // armyPacked,
      lastAttacked,
      level,
      callSign
    };

    await this.context.prisma.army.upsert({
      where: { realmId_armyId: { realmId, armyId } },
      create: { realmId, armyId, ...updates },
      update: { ...updates }
    });
  }

  async combatStart(_event: Event) {}
  async combatEnd(event: Event) {
    if (event.blockNumber < START_BLOCK) {
      return;
    }

    const params = event.parameters ?? [];
    const armyLength = BATTALION_ATTR_LENGTH * BATTALION_LENGTH + 3;

    const eventId = event.eventId;
    const combatOutcome = +params[0];

    // Update attacking Army
    const attackParams = params.slice(1, armyLength + 1);
    const attackArmyId = +attackParams[0];
    const attackRealmId = arrayUInt256ToNumber(attackParams.slice(1, 3));

    // get army state before updating army
    const attackingArmyStart = await this.context.prisma.army.findUnique({
      where: {
        realmId_armyId: {
          armyId: attackArmyId,
          realmId: attackRealmId
        }
      },
      select: ARMY_SEELCT
    });

    // update attacking army
    const attackingRealm = await this.updateArmy(
      attackParams,
      combatOutcome !== COMBAT_OUTCOME_ATTACKER_WINS
    );

    // Update defending Army
    const defendingParams = params.slice(armyLength + 1);
    const defendingArmyId = +defendingParams[0];
    const defendingRealmId = arrayUInt256ToNumber(defendingParams.slice(1, 3));
    const defendingArmyStart = await this.context.prisma.army.findUnique({
      where: {
        realmId_armyId: {
          armyId: defendingArmyId,
          realmId: defendingRealmId
        }
      },

      select: ARMY_SEELCT
    });
    const defendingRealm = await this.updateArmy(
      defendingParams,
      combatOutcome === COMBAT_OUTCOME_ATTACKER_WINS
    );

    const defendingRealmOwner = await this.getRealm(defendingRealm.realmId);
    const attackRealmOwner = await this.getRealm(attackingRealm.realmId);
    const pillagedResources = (await this.getPillagedResources(eventId)) ?? [];
    // Check for relic
    const { relicAttackData, relicDefendData } = await this.getRelicData(
      eventId
    );

    const updates = [];

    // Update Realm Attack History
    updates.push(
      this.saveRealmHistory({
        realmId: attackingRealm.realmId,
        eventId,
        eventType: "realm_combat_attack",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          success: combatOutcome === COMBAT_OUTCOME_ATTACKER_WINS,
          defendRealmOwner: defendingRealmOwner.account,
          defendRealmName: defendingRealmOwner.name,
          defendRealmId: defendingRealm.realmId,
          pillagedResources,
          ...relicAttackData,
          armiesStart: [attackingArmyStart, defendingArmyStart],
          armiesEnd: [attackingRealm, defendingRealm]
        }
      })
    );

    // Update Realm Defence History
    // TODO: conditional when goblins are enabled on combat v3
    updates.push(
      this.saveRealmHistory({
        realmId: defendingRealm.realmId,
        eventId,
        account: defendingRealmOwner.account,
        eventType: "realm_combat_defend",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          success: combatOutcome !== COMBAT_OUTCOME_ATTACKER_WINS,
          attackRealmOwner: attackRealmOwner,
          attackRealmId: attackingRealm.realmId,
          attackRealmName: attackRealmOwner.name,
          pillagedResources,
          ...relicDefendData,
          armiesStart: [attackingArmyStart, defendingArmyStart],
          armiesEnd: [attackingRealm, defendingRealm]
        }
      })
    );

    // Update Last attack time
    updates.push(
      this.context.prisma.realm.update({
        where: { realmId: defendingRealm.realmId },
        data: { lastAttacked: event.timestamp }
      })
    );

    await Promise.all(updates);
  }

  async updateArmy(params: string[], isArmyDefeated: boolean) {
    const armyId = +params[0];
    const realmId = arrayUInt256ToNumber(params.slice(1, 3));
    const battalionStats = params
      .slice(3, 3 + BATTALION_LENGTH * BATTALION_ATTR_LENGTH)
      .map((val) => +val);

    const battalions = this.parseBattalionStats(battalionStats);
    if (isArmyDefeated) {
      console.log("Realm", realmId, "Army:", armyId, "defeated");
      await this.context.prisma.army.delete({
        where: { realmId_armyId: { realmId, armyId } }
      });
    } else {
      await this.context.prisma.army.upsert({
        where: { realmId_armyId: { realmId, armyId } },
        create: {
          realmId,
          armyId,
          ...battalions
        },
        update: {
          ...battalions
        }
      });
    }

    return {
      armyId,
      realmId,
      ...battalions
    };
  }

  parseBattalionStats(battalions: number[]) {
    if (battalions.length < BATTALION_LENGTH * BATTALION_ATTR_LENGTH) {
      console.error("Battalions format error");
    }
    return {
      lightCavalryQty: battalions[0] ?? 0,
      lightCavalryHealth: battalions[1] ?? 0,
      heavyCavalryQty: battalions[2] ?? 0,
      heavyCavalryHealth: battalions[3] ?? 0,
      archerQty: battalions[4] ?? 0,
      archerHealth: battalions[5] ?? 0,
      longbowQty: battalions[6] ?? 0,
      longbowHealth: battalions[7] ?? 0,
      mageQty: battalions[8] ?? 0,
      mageHealth: battalions[9] ?? 0,
      arcanistQty: battalions[10] ?? 0,
      arcanistHealth: battalions[11] ?? 0,
      lightInfantryQty: battalions[12] ?? 0,
      lightInfantryHealth: battalions[13] ?? 0,
      heavyInfantryQty: battalions[14] ?? 0,
      heavyInfantryHealth: battalions[15] ?? 0
    };
  }

  async getRelicData(eventId: string) {
    const relicAttackData = {} as any;
    const relicDefendData = {} as any;
    let [blockNum, transactionNum, eventNumber] = eventId.split("_");
    // Relic wll be the event prior to the combat outcome event
    const previousEventNumber = parseInt(eventNumber) - 1;
    if (previousEventNumber > 0) {
      const relicEventId = [
        blockNum,
        transactionNum,
        String(previousEventNumber).padStart(4, "0")
      ].join("_");
      const relicEvent = await this.context.prisma.realmHistory.findFirst({
        where: { eventId: relicEventId, eventType: "relic_update" }
      });
      if (relicEvent) {
        relicAttackData.relicClaimed = relicEvent.realmId;
        relicDefendData.relicLost = relicEvent.realmId;
      }
    }
    return {
      relicAttackData,
      relicDefendData
    };
  }

  async getRealm(realmId: number) {
    const realm = await this.context.prisma.realm.findFirst({
      where: { realmId }
    });
    const account = realm?.settledOwner || realm?.ownerL2 || "";
    const name = realm?.name;
    return { account, name };
  }

  async getPillagedResources(eventId: string) {
    const [blockNumber, transactionNumber] = eventId.split("_");

    const resources = await this.context.prisma.resourceTransfer.findMany({
      where: {
        blockNumber: parseInt(blockNumber),
        transactionNumber: parseInt(transactionNumber)
      }
    });
    return resources.map((resource) => {
      return {
        resourceId: resource.resourceId,
        resourceName: ResourceNameById[String(resource.resourceId)] ?? "",
        amount: resource.amount
      };
    });
  }
}
