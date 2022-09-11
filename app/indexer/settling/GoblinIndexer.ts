import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
// import { uint256ToBN } from "starknet/utils/uint256";
// import { BigNumberish } from "starknet/utils/number";
// import { GOBLIN_SQUAD_SLOT } from "../../utils/game_constants";
// import CombatIndexer, {
//   SQUAD_LENGTH,
//   SQUAD_ATTRIBUTES_LENGTH
// } from "./CombatIndexer";

const CONTRACT =
  "0x03f233b0c1aa84b4a05ff55c7a3a0c1f6ba876030b06200ac27e80f338f59120";

// function arrayUInt256ToNumber([low, high]: any[]): BigNumberish {
//   return parseInt(uint256ToBN({ low, high }).toString());
// }

//Troop(id=1, type=TroopType.Melee, tier=1, building=1, agility=1, attack=1, armor=3, vitality=4, wisdom=1),

export default class GoblinIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("GoblinSpawn", this.goblinSpawn.bind(this));
  }

  async goblinSpawn(_event: Event) {
    // const params = event.parameters ?? [];
    // const realmId = arrayUInt256ToNumber(params.slice(0, 2));
    // const squad = params.slice(2, SQUAD_ATTRIBUTES_LENGTH * SQUAD_LENGTH + 2);
    // const timestamp = parseInt(params[params.length - 1]);
    // await this.updateGoblinSquad(realmId, squad, new Date(timestamp * 1000));
  }

  // async updateGoblinSquad(realmId: number, squad: any[], timestamp: Date) {
  //   const updateSquad = [];
  //   const squadSlot = GOBLIN_SQUAD_SLOT;
  //   for (let i = 0; i < SQUAD_LENGTH; i++) {
  //     const troop = squad.slice(
  //       i * SQUAD_ATTRIBUTES_LENGTH,
  //       (i + 1) * SQUAD_ATTRIBUTES_LENGTH
  //     );

  //     const update = CombatIndexer.parseTroop(troop);
  //     updateSquad.push(
  //       this.context.prisma.troop.upsert({
  //         where: {
  //           realmId_index_squadSlot: {
  //             realmId,
  //             squadSlot,
  //             index: i
  //           }
  //         },
  //         update,
  //         create: {
  //           ...update,
  //           realmId,
  //           squadSlot,
  //           index: i,
  //           timestamp
  //         }
  //       })
  //     );
  //   }
  //   await this.context.prisma.$transaction(updateSquad);
  // }
}
