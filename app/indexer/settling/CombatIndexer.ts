import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import {
  // GOBLIN_SQUAD_SLOT,
  // ATTACKING_SQUAD_SLOT,
  // DEFENDING_SQUAD_SLOT,
  COMBAT_OUTCOME_ATTACKER_WINS,
  COMBAT_OUTCOME_DEFENDER_WINS,
  ResourceNameById
} from "../../utils/game_constants";

const CONTRACT =
  "0x04d4e010850d0df3c6fd9672a72328514acc5e1285935104a29d215184903582";

const START_BLOCK = 331146;

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

    // Ignor Army data
    // Deprecated
    const armyPacked = 0; //+params[3];
    const lastAttacked = 0; //+params[4];
    const level = 0; //+params[5];
    const callSign = 0; //+params[6];

    const updates = {
      armyPacked,
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
    const attackingRealm = await this.updateArmy(
      params.slice(1, armyLength + 1),
      combatOutcome === COMBAT_OUTCOME_DEFENDER_WINS
    );
    // Update defending Army
    const defendingRealm = await this.updateArmy(
      params.slice(armyLength + 1),
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
        account: event.toAddress,
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          success: combatOutcome === COMBAT_OUTCOME_ATTACKER_WINS,
          defendRealmOwner: defendingRealmOwner.account,
          defendRealmName: defendingRealmOwner.name,
          defendRealmId: defendingRealm.realmId,
          pillagedResources,
          ...relicAttackData
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
          success: combatOutcome === COMBAT_OUTCOME_DEFENDER_WINS,
          attackRealmOwner: event.toAddress,
          attackRealmId: attackingRealm.realmId,
          attackRealmName: attackRealmOwner.name,
          pillagedResources,
          ...relicDefendData
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

    // const isArmyDefeated =
    //   battalionStats.reduce((sum, current) => sum + current, 0) === 0;
    if (isArmyDefeated) {
      console.log("Realm", realmId, "Army:", armyId, "defeated");
      await this.context.prisma.army.delete({
        where: { realmId_armyId: { realmId, armyId } }
      });
    } else {
      const battalions = this.parseBattalionStats(battalionStats);
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
      realmId
    };
  }

  parseBattalionStats(battalions: number[]) {
    if (battalions.length < BATTALION_LENGTH * BATTALION_ATTR_LENGTH) {
      console.error("Battalions format error");
    }
    return {
      lightCavalryQty: battalions[0],
      lightCavalryHealth: battalions[1],
      heavyCavalryQty: battalions[2],
      heavyCavalryHealth: battalions[3],
      archerQty: battalions[4],
      archerHealth: battalions[5],
      longbowQty: battalions[6],
      longbowHealth: battalions[7],
      mageQty: battalions[8],
      mageHealth: battalions[9],
      arcanistQty: battalions[10],
      arcanistHealth: battalions[11],
      lightInfantryQty: battalions[12],
      lightInfantryHealth: battalions[13],
      heavyInfantryQty: battalions[14],
      heavyInfantryHealth: battalions[15]
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
