import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import BaseContractIndexer from "./BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import {
  TroopStat,
  TroopName,
  Troop,
  ATTACKING_SQUAD_SLOT,
  DEFENDING_SQUAD_SLOT
} from "../utils/game_constants";

const CONTRACT =
  "0x0143c2b110961626f46c4b35c55fa565227ffdb803155e917df790bad29240b9";

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}

function findTroopIdFromStats(stats: any[]): number {
  const statsKey = stats.slice(0, 4).join("");
  const names = Object.keys(TroopStat) as TroopName[];
  for (let name of names) {
    const currentKey = TroopStat[name].slice(0, 4).join("");
    if (statsKey === currentKey) {
      return Troop[name];
    }
  }
  return 0;
}
//Troop(type=TroopType.Melee, tier=1, agility=1, attack=1, defense=3, vitality=4, wisdom=1),

const TROOP_STATS_LENGTH = 7;
const SQUAD_LENGTH = 25;

export default class RealmsTroopsIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("BuildTroops_1", this.buildTroops.bind(this));
    this.on("CombatStart_1", this.combatStart.bind(this));
    this.on("CombatStep_1", this.combatStep.bind(this));
    this.on("CombatOutcome_1", this.combatOutcome.bind(this));
  }

  async buildTroops(event: Event) {
    const params = event.parameters ?? [];
    const squad = params.slice(0, TROOP_STATS_LENGTH * SQUAD_LENGTH);
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

  async combatOutcome(event: Event) {
    const params = event.parameters ?? [];
    if (params.length < SQUAD_LENGTH * TROOP_STATS_LENGTH) {
      // IGNORE OLD EVENT
      return;
    }
    const attackingRealmId = arrayUInt256ToNumber(params.slice(0, 2));
    const defendingRealmId = arrayUInt256ToNumber(params.slice(2, 4));

    const endAttackSquad = 4 + SQUAD_LENGTH * TROOP_STATS_LENGTH;
    const attackingSquad = params.slice(4, endAttackSquad);
    const defendingSquad = params.slice(
      endAttackSquad,
      endAttackSquad + SQUAD_LENGTH * TROOP_STATS_LENGTH
    );

    await Promise.all([
      this.updateSquad(attackingRealmId, attackingSquad, ATTACKING_SQUAD_SLOT),
      this.updateSquad(defendingRealmId, defendingSquad, DEFENDING_SQUAD_SLOT)
    ]);

    //TODO: handle hit points
  }

  async updateSquad(realmId: number, squad: any[], squadSlot: number) {
    const updateSquad = [];
    for (let i = 0; i < SQUAD_LENGTH; i++) {
      const troop = squad.slice(
        i * TROOP_STATS_LENGTH,
        (i + 1) * TROOP_STATS_LENGTH
      );
      const troopId = findTroopIdFromStats(troop);
      const type = parseInt(troop[0]);
      const tier = parseInt(troop[1]);
      const agility = parseInt(troop[2]);
      const attack = parseInt(troop[3]);
      const defense = parseInt(troop[4]);
      const vitality = parseInt(troop[5]);
      const wisdom = parseInt(troop[6]);
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
