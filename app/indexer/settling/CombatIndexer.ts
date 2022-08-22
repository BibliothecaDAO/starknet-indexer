import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { uint256ToBN } from "starknet/utils/uint256";
import { BigNumberish } from "starknet/utils/number";
import {
  ATTACKING_SQUAD_SLOT,
  DEFENDING_SQUAD_SLOT,
  ResourceNameById
} from "../../utils/game_constants";

const CONTRACT =
  "0x0139bad2b0b220d71ea1fc48fa2858e993b3d471a3b03be609c54ff0c9795d71";

function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
  return parseInt(uint256ToBN({ low, high }).toString());
}

//Troop(id=1, type=TroopType.Melee, tier=1, building=1, agility=1, attack=1, armor=3, vitality=4, wisdom=1),

const SQUAD_LENGTH = 15;

export default class CombatIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("BuildTroops_3", this.buildTroops_3.bind(this));
    this.on("CombatStart_3", this.combatStart_3.bind(this));
    this.on("CombatStep_3", this.combatStep_3.bind(this));
    this.on("CombatOutcome_3", this.combatOutcome_3.bind(this));
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

  async combatStart_3(event: Event) {
    const params = event.parameters ?? [];
    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad
    } = this.parseRealmsAndSquads_3(params);
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

  async combatStep_3(event: Event) {
    const params = event.parameters ?? [];
    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      params: remainingParams
    } = this.parseRealmsAndSquads_3(params);

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
    const hitPoints = parseInt(params[0]);
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

  async combatOutcome_3(event: Event) {
    const params = event.parameters ?? [];
    const {
      attackingRealmId,
      defendingRealmId,
      attackingSquad,
      defendingSquad,
      params: remainingParams
    } = this.parseRealmsAndSquads_3(params);
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

    // Check for relic
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
          pillagedResources,
          ...relicAttackData
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
          pillagedResources,
          ...relicDefendData
        }
      })
    ]);
    // handle hit points
  }

  async updateSquad(realmId: number, squad: any[], squadSlot: number) {
    const troopLen = 9;
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

  parseRealmsAndSquads_3(params: string[]) {
    const troopLength = 9;
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
    const building = parseInt(troop[3]);
    const agility = parseInt(troop[4]);
    const attack = parseInt(troop[5]);
    const armor = parseInt(troop[6]);
    const vitality = parseInt(troop[7]);
    const wisdom = parseInt(troop[8]);
    return {
      troopId,
      type,
      tier,
      building,
      agility,
      attack,
      armor,
      vitality,
      wisdom
    };
  }

  arrayToTroopArray(squad: string[]) {
    const troopArray = [];
    for (let i = 0; i < squad.length; i += 9) {
      const troop = squad.slice(i, i + 9);
      troopArray.push(this.parseTroop(troop));
    }
    return troopArray;
  }
}
