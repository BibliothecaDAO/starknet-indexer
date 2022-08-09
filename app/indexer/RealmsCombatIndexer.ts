import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import BaseContractIndexer from "./BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import {
  TroopStat,
  TroopName,
  TroopId,
  ATTACKING_SQUAD_SLOT,
  DEFENDING_SQUAD_SLOT,
  ResourceNameById
} from "../utils/game_constants";

const CONTRACT =
  "0x0139bad2b0b220d71ea1fc48fa2858e993b3d471a3b03be609c54ff0c9795d71";

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}

function findTroopIdFromStats(stats: any[]): string {
  const statsKey = stats.slice(0, 4).join("");
  const names = Object.keys(TroopStat) as TroopName[];
  for (let name of names) {
    const currentKey = TroopStat[name].slice(0, 4).join("");
    if (statsKey === currentKey) {
      return TroopId[name].toString();
    }
  }
  return "0";
}

function convertSquadV1ToSquadV2(squadV1: string[]): string[] {
  const troopLen = 7;
  let squadV2: string[] = [];
  for (let i = 0; i < SQUAD_LENGTH; i++) {
    const troop = squadV1.slice(i * troopLen, (i + 1) * troopLen);
    const troopId = findTroopIdFromStats(troop);
    squadV2 = [...squadV2, troopId, ...troop];
  }
  return squadV2;
}
//Troop(type=TroopType.Melee, tier=1, agility=1, attack=1, armor=3, vitality=4, wisdom=1),

const SQUAD_LENGTH = 15;

export default class RealmsCombatIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("BuildTroops_1", this.buildTroops_1.bind(this));
    this.on("CombatStart_1", this.combatStart_1.bind(this));
    this.on("CombatStep_1", this.combatStep_1.bind(this));
    this.on("CombatOutcome_1", this.combatOutcome_1.bind(this));

    this.on("BuildTroops_2", this.buildTroops_2.bind(this));
    this.on("BuildTroops_3", this.buildTroops_3.bind(this));

    this.on("CombatStart_2", this.combatStart_2.bind(this));
    this.on("CombatStep_2", this.combatStep_2.bind(this));
    this.on("CombatOutcome_2", this.combatOutcome_2.bind(this));
  }

  async buildTroops_1(event: Event) {
    const params = event.parameters ?? [];
    const squad = params.slice(0, 7 * SQUAD_LENGTH);
    const squadSlot = parseInt(params[params.length - 1]);
    const realmId = arrayUInt256ToNumber(
      params.slice(params.length - 3, params.length - 1)
    );

    await this.updateSquad(realmId, convertSquadV1ToSquadV2(squad), squadSlot);
  }

  async buildTroops_2(event: Event) {

    const params = event.parameters ?? [];
    const squad = params.slice(0, 9 * SQUAD_LENGTH);
    const squadSlot = parseInt(params[params.length - 1]);
    const realmId = arrayUInt256ToNumber(
      params.slice(params.length - 3, params.length - 1)
    );

    await this.updateSquad(realmId, squad, squadSlot);
  }
  async buildTroops_3(event: Event) {

    const params = event.parameters ?? [];
    const squad = params.slice(0, 9 * SQUAD_LENGTH);
    const squadSlot = parseInt(params[params.length - 1]);
    const realmId = arrayUInt256ToNumber(
      params.slice(params.length - 3, params.length - 1)
    );

    await this.updateSquad(realmId, squad, squadSlot);
  }
  async combatStart_1(event: Event) {
    const params = event.parameters ?? [];

    if (params.length < SQUAD_LENGTH * 7) {
      // IGNORE OLD EVENT
      return;
    }

    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad
    } = this.parseRealmsAndSquads_1(params);
    await this.combatStart(
      event,
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad
    );
  }

  async combatStart_2(event: Event) {
    const params = event.parameters ?? [];
    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad
    } = this.parseRealmsAndSquads_2(params);
    await this.combatStart(
      event,
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad
    );
  }

  async combatStart(
    event: Event,
    attackingRealmId: number,
    defendingRealmId: number,
    attackingSquad: string[],
    defendingSquad: string[]
  ) {
    const eventId = event.eventId;
    const defendingRealmOwner = await this.getRealmOwner(defendingRealmId);
    const combatStartUpdate = {
      eventType: "combat_start",
      attackRealmId: attackingRealmId,
      attackRealmOwner: event.toAddress,
      attackSquad: this.arrayToTroopArray(attackingSquad),
      defendRealmOwner: defendingRealmOwner,
      defendSquad: this.arrayToTroopArray(defendingSquad),
      timestamp: event.timestamp,
      transactionHash: event.txHash
    };

    await this.context.prisma.combatHistory.upsert({
      where: {
        defendRealmId_eventId: {
          defendRealmId: defendingRealmId,
          eventId: eventId
        }
      },
      update: { ...combatStartUpdate },
      create: {
        ...combatStartUpdate,
        defendRealmId: defendingRealmId,
        eventId
      }
    });
  }

  async combatStep_1(event: Event) {
    const params = event.parameters ?? [];

    if (params.length < SQUAD_LENGTH * 7) {
      // IGNORE OLD EVENT
      return;
    }

    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      params: remainingParams
    } = this.parseRealmsAndSquads_1(params);

    await this.combatStep(
      event,
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      remainingParams
    );
  }

  async combatStep_2(event: Event) {
    const params = event.parameters ?? [];
    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      params: remainingParams
    } = this.parseRealmsAndSquads_2(params);

    await this.combatStep(
      event,
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      remainingParams
    );
  }

  async combatStep(
    event: Event,
    attackingRealmId: number,
    defendingRealmId: number,
    attackingSquad: string[],
    defendingSquad: string[],
    params: string[]
  ) {
    const eventId = event.eventId;
    const attackType = parseInt(params[0]);
    const hitPoints = parseInt(params[1]);
    const defendingRealmOwner = await this.getRealmOwner(defendingRealmId);

    const combatStepUpdate = {
      eventType: "combat_step",
      attackRealmId: attackingRealmId,
      attackRealmOwner: event.toAddress,
      attackSquad: this.arrayToTroopArray(attackingSquad),
      defendRealmOwner: defendingRealmOwner,
      defendSquad: this.arrayToTroopArray(defendingSquad),
      timestamp: event.timestamp,
      transactionHash: event.txHash,
      attackType,
      hitPoints
    };

    await this.context.prisma.combatHistory.upsert({
      where: {
        defendRealmId_eventId: {
          defendRealmId: defendingRealmId,
          eventId: eventId
        }
      },
      update: { ...combatStepUpdate },
      create: {
        ...combatStepUpdate,
        defendRealmId: defendingRealmId,
        eventId
      }
    });
  }

  async combatOutcome_1(event: Event) {
    const params = event.parameters ?? [];
    if (params.length < SQUAD_LENGTH * 7) {
      // IGNORE OLD EVENT
      return;
    }

    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      params: remainingParams
    } = this.parseRealmsAndSquads_1(params);

    const outcome = parseInt(remainingParams[0]);
    await this.combatOutcome(
      event,
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      outcome
    );
  }

  async combatOutcome_2(event: Event) {
    const params = event.parameters ?? [];
    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      params: remainingParams
    } = this.parseRealmsAndSquads_2(params);
    const outcome = parseInt(remainingParams[0]);
    await this.combatOutcome(
      event,
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      outcome
    );
  }

  async combatOutcome(
    event: Event,
    attackingRealmId: number,
    defendingRealmId: number,
    attackingSquad: string[],
    defendingSquad: string[],
    outcome: number
  ) {
    const eventId = event.eventId;
    await Promise.all([
      this.updateSquad(attackingRealmId, attackingSquad, ATTACKING_SQUAD_SLOT),
      this.updateSquad(defendingRealmId, defendingSquad, DEFENDING_SQUAD_SLOT)
    ]);

    const defendingRealmOwner = await this.getRealmOwner(defendingRealmId);

    const [blockNumber, transactionNumber] = eventId.split("_");
    const pillagedResources = (
      (await this.getPillagedResources(
        parseInt(blockNumber),
        parseInt(transactionNumber)
      )) ?? []
    ).map((resource) => {
      return {
        resourceId: resource.resourceId,
        resourceName: ResourceNameById[String(resource.resourceId)] ?? "",
        amount: resource.amount
      };
    });

    const combatHistoryUpdate = {
      eventType: "combat_outcome",
      attackRealmId: attackingRealmId,
      attackRealmOwner: event.toAddress,
      attackSquad: this.arrayToTroopArray(attackingSquad),
      defendRealmOwner: defendingRealmOwner,
      defendSquad: this.arrayToTroopArray(defendingSquad),
      timestamp: event.timestamp,
      transactionHash: event.txHash,
      outcome
    };
    await Promise.all([
      this.context.prisma.combatHistory.upsert({
        where: {
          defendRealmId_eventId: {
            defendRealmId: defendingRealmId,
            eventId: eventId
          }
        },
        update: { ...combatHistoryUpdate },
        create: {
          ...combatHistoryUpdate,
          defendRealmId: defendingRealmId,
          eventId
        }
      }),
      this.context.prisma.realm.update({
        where: { realmId: defendingRealmId },
        data: { lastAttacked: event.timestamp }
      }),
      this.saveRealmHistory({
        realmId: attackingRealmId,
        eventId,
        eventType: "realm_combat_attack",
        account: event.toAddress,
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          success: outcome === 1,
          defendRealmOwner: defendingRealmOwner,
          defendRealmId: defendingRealmId,
          pillagedResources
        }
      }),
      this.saveRealmHistory({
        realmId: defendingRealmId,
        eventId,
        account: defendingRealmOwner,
        eventType: "realm_combat_defend",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          success: outcome === 2,
          attackRealmOwner: event.toAddress,
          attackRealmId: attackingRealmId,
          pillagedResources
        }
      })
    ]);
    // handle hit points
  }

  async updateSquad(realmId: number, squad: any[], squadSlot: number) {
    const troopLen = 8;
    const updateSquad = [];
    for (let i = 0; i < SQUAD_LENGTH; i++) {
      const troop = squad.slice(i * troopLen, (i + 1) * troopLen);
      const update = this.parseTroop(troop);
      updateSquad.push(
        this.context.prisma.troop.upsert({
          where: {
            realmId_index_squadSlot: {
              realmId,
              squadSlot,
              index: i
            }
          },
          update,
          create: { ...update, realmId, squadSlot, index: i }
        })
      );
    }
    await this.context.prisma.$transaction(updateSquad);
  }

  async getRealmOwner(realmId: number) {
    const defendingRealm = await this.context.prisma.realm.findFirst({
      where: { realmId }
    });
    const defendingRealmOwner =
      defendingRealm?.settledOwner || defendingRealm?.ownerL2 || "";

    return defendingRealmOwner;
  }

  parseRealmsAndSquads_1(params: string[]) {
    const troopLength = 7;

    const attackingRealmId = arrayUInt256ToNumber(params.slice(0, 2));
    const defendingRealmId = arrayUInt256ToNumber(params.slice(2, 4));
    const endAttackSquad = 4 + SQUAD_LENGTH * troopLength;
    const attackingSquad = params.slice(4, endAttackSquad);

    const defendingSquad = params.slice(
      endAttackSquad,
      endAttackSquad + SQUAD_LENGTH * troopLength
    );
    return {
      attackingRealmId,
      defendingRealmId,
      attackingSquad: convertSquadV1ToSquadV2(attackingSquad),
      defendingSquad: convertSquadV1ToSquadV2(defendingSquad),
      params: params.slice(endAttackSquad + SQUAD_LENGTH * troopLength)
    };
  }

  parseRealmsAndSquads_2(params: string[]) {
    const troopLength = 8;
    const attackingRealmId = arrayUInt256ToNumber(params.slice(0, 2));
    const defendingRealmId = arrayUInt256ToNumber(params.slice(2, 4));
    const endAttackSquad = 4 + SQUAD_LENGTH * troopLength;
    const attackingSquad = params.slice(4, endAttackSquad);
    const defendingSquad = params.slice(
      endAttackSquad,
      endAttackSquad + SQUAD_LENGTH * troopLength
    );
    return {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      params: params.slice(endAttackSquad + SQUAD_LENGTH * troopLength)
    };
  }

  async getPillagedResources(blockNumber: number, transactionNumber: number) {
    return await this.context.prisma.resourceTransfer.findMany({
      where: {
        blockNumber,
        transactionNumber
      }
    });
  }

  parseTroop(troop: string[]) {
    const troopId = parseInt(troop[0]);
    const type = parseInt(troop[1]);
    const tier = parseInt(troop[2]);
    const agility = parseInt(troop[3]);
    const attack = parseInt(troop[4]);
    const armor = parseInt(troop[5]);
    const vitality = parseInt(troop[6]);
    const wisdom = parseInt(troop[7]);
    return {
      troopId,
      type,
      tier,
      agility,
      attack,
      armor,
      vitality,
      wisdom
    };
  }

  arrayToTroopArray(squad: string[]) {
    const troopArray = [];
    for (let i = 0; i < squad.length; i += 8) {
      const troop = squad.slice(i, i + 8);
      troopArray.push(this.parseTroop(troop));
    }
    return troopArray;
  }
}
