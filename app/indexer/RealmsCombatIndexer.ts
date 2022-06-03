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
  DEFENDING_SQUAD_SLOT
} from "../utils/game_constants";

const CONTRACT =
  "0x0143c2b110961626f46c4b35c55fa565227ffdb803155e917df790bad29240b9";

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
//Troop(type=TroopType.Melee, tier=1, agility=1, attack=1, defense=3, vitality=4, wisdom=1),

const SQUAD_LENGTH = 25;

export default class RealmsCombatIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("BuildTroops_1", this.buildTroops_1.bind(this));
    this.on("CombatStart_1", this.combatStart.bind(this));
    this.on("CombatStep_1", this.combatStep.bind(this));
    this.on("CombatOutcome_1", this.combatOutcome_1.bind(this));

    this.on("BuildTroops_2", this.buildTroops_2.bind(this));
    this.on("CombatStart_2", this.combatStart.bind(this));
    this.on("CombatStep_2", this.combatStep.bind(this));
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
    const squad = params.slice(0, 8 * SQUAD_LENGTH);
    const squadSlot = parseInt(params[params.length - 1]);
    const realmId = arrayUInt256ToNumber(
      params.slice(params.length - 3, params.length - 1)
    );

    await this.updateSquad(realmId, squad, squadSlot);
  }

  // TODO
  async combatStart(/*event: Event*/) {
    // const params = event.parameters ?? [];
    // const attackingRealmId = arrayUInt256ToNumber(params.slice(0, 2));
    // const defendingRealmId = arrayUInt256ToNumber(params.slice(2, 4));
  }

  // TODO
  async combatStep(/*event: Event*/) {
    // const params = event.parameters ?? [];
    // const attackingRealmId = arrayUInt256ToNumber(params.slice(0, 2));
    // const defendingRealmId = arrayUInt256ToNumber(params.slice(2, 4));
  }

  async combatOutcome_1(event: Event) {
    const params = event.parameters ?? [];
    const troopLength = 7;
    if (params.length < SQUAD_LENGTH * troopLength) {
      return;
    }
    const attackingRealmId = arrayUInt256ToNumber(params.slice(0, 2));
    const defendingRealmId = arrayUInt256ToNumber(params.slice(2, 4));
    const endAttackSquad = 4 + SQUAD_LENGTH * troopLength;
    const attackingSquad = params.slice(4, endAttackSquad);

    const defendingSquad = params.slice(
      endAttackSquad,
      endAttackSquad + SQUAD_LENGTH * troopLength
    );
    const outcome = parseInt(params[params.length - 1]);
    await this.combatOutcome(
      event,
      attackingRealmId,
      defendingRealmId,
      convertSquadV1ToSquadV2(attackingSquad),
      convertSquadV1ToSquadV2(defendingSquad),
      outcome
    );
  }

  async combatOutcome_2(event: Event) {
    const troopLength = 8;
    const params = event.parameters ?? [];
    if (params.length < SQUAD_LENGTH * troopLength) {
      // IGNORE OLD EVENT
      return;
    }
    const attackingRealmId = arrayUInt256ToNumber(params.slice(0, 2));
    const defendingRealmId = arrayUInt256ToNumber(params.slice(2, 4));
    const endAttackSquad = 4 + SQUAD_LENGTH * troopLength;
    const attackingSquad = params.slice(4, endAttackSquad);
    const defendingSquad = params.slice(
      endAttackSquad,
      endAttackSquad + SQUAD_LENGTH * troopLength
    );
    const outcome = parseInt(params[params.length - 1]);
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

    const defendingRealm = await this.context.prisma.realm.findFirst({
      where: { realmId: defendingRealmId }
    });
    const defendingRealmOwner =
      defendingRealm?.settledOwner || defendingRealm?.ownerL2 || "";

    await Promise.all([
      this.context.prisma.realm.update({
        where: { realmId: defendingRealmId },
        data: { lastAttacked: event.timestamp }
      }),
      this.saveRealmEvent({
        realmId: attackingRealmId,
        eventId,
        eventType: "realm_combat_attack",
        account: event.toAddress,
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          success: outcome === 1,
          defendRealmOwner: defendingRealmOwner
        }
      }),
      this.saveRealmEvent({
        realmId: defendingRealmId,
        eventId,
        account: defendingRealmOwner,
        eventType: "realm_combat_defend",
        timestamp: event.timestamp,
        transactionHash: event.txHash,
        data: {
          success: outcome === 2,
          attackRealmOwner: event.toAddress
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
      const troopId = parseInt(troop[0]);
      const type = parseInt(troop[1]);
      const tier = parseInt(troop[2]);
      const agility = parseInt(troop[3]);
      const attack = parseInt(troop[4]);
      const defense = parseInt(troop[5]);
      const vitality = parseInt(troop[6]);
      const wisdom = parseInt(troop[7]);
      const stats = {
        troopId,
        type,
        tier,
        agility,
        attack,
        defense,
        vitality,
        wisdom
      };
      updateSquad.push(
        this.context.prisma.troop.upsert({
          where: {
            realmId_index_squadSlot: {
              realmId,
              squadSlot,
              index: i
            }
          },
          update: { ...stats },
          create: { ...stats, realmId, squadSlot, index: i }
        })
      );
    }
    await this.context.prisma.$transaction(updateSquad);
  }
}
