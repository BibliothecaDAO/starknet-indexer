import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import BaseContractIndexer from "./BaseContractIndexer";

const CONTRACT =
  "0x0143c2b110961626f46c4b35c55fa565227ffdb803155e917df790bad29240b9";
export default class RealmsTroopsIndexer extends BaseContractIndexer {
  constructor(context: Context) {
    super(context, CONTRACT);

    this.addHandler("Build_toops", this.buildTroops.bind(this));
  }

  async buildTroops(event: Event) {
    const params = event.parameters ?? [];
    let realmId = 0;
    try {
      const troopsLen = parseInt(params[0]);
      const troops = params.slice(1, troopsLen + 1);
      realmId = parseInt(params[troopsLen + 1]);
      const isAttack = params[params.length - 1] === "1";
      const data = {} as any;
      if (isAttack) {
        data.attackTroopIds = [...troops];
      } else {
        data.defendTroopIds = [...troops];
      }

      await this.context.prisma.realm.update({
        where: { realmId },
        data
      });
    } catch (e) {
      console.error(
        `Invalid troops upgrade: realmId: ${realmId} Event: ${event.eventId}, Params: `,
        JSON.stringify(params)
      );
    }
  }
}
