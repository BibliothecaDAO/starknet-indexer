import { Event } from "./../../entities/starknet/Event";
import { Context } from "./../../context";
import { BigNumber } from "ethers";
import { Contract } from "starknet";
import TowerDefenceABI from "./../../abis/01_TowerDefence.json";
import { toBN } from "starknet/utils/number";
import BaseContractIndexer from "./../BaseContractIndexer";

const CONTRACT =
  "0xcb953e715b337d58bc9d3fd3e67bfbf3ca0a1271e6e7dd36bb31140bfc3903";
export default class DesiegeIndexer extends BaseContractIndexer {
  private contract: Contract = new Contract(TowerDefenceABI as any, CONTRACT);

  constructor(context: Context) {
    super(context, CONTRACT);

    this.on("game_started", this.startGame.bind(this));
    this.on("game_action", this.updateGame.bind(this));
    this.on("tower_damage_inflicted", this.inflictDamage.bind(this));
  }

  async startGame(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const gameId = parseInt(params[0]);
    try {
      const startedOn = event.timestamp;
      const initialHealth = parseInt(params[1]);
      const startBlock = event.blockNumber;
      let endBlock = 0;
      try {
        const gameCtx = await this.getGameVariables();
        endBlock =
          startBlock + 60 * gameCtx.hoursPerGame * gameCtx.blocksPerMinute;
      } catch (e) {
        console.error(`Error getting game variables for game${gameId}`);
        throw e;
      }
      const updates = {
        startedOn,
        startBlock,
        initialHealth,
        endBlock,
        eventIndexed: event.eventId
      };

      await this.context.prisma.desiege.upsert({
        where: { gameId },
        update: updates,
        create: {
          gameId,
          ...updates,
          attackedTokens: 0,
          defendedTokens: 0,
          winner: 0
        }
      });
    } catch (e) {
      console.error(`Error indexing game start: ${gameId}`);
      throw e;
    }
  }

  async updateGame(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const isV2 = params.length === 7;
    const gameId = parseInt(params[0]);
    try {
      const tokenOffset = parseInt(params[2]);
      const tokenAmount = parseInt(params[3]);
      const boostedAmount = isV2 ? parseInt(params[4]) : 0;
      const account = isV2 ? BigNumber.from(params[6]).toHexString() : "";
      const attackedTokens = tokenOffset === 2 ? tokenAmount : 0;
      const defendedTokens = tokenOffset === 1 ? tokenAmount : 0;

      await this.context.prisma.desiegeAction.create({
        data: {
          gameId,
          account,
          amount: tokenAmount,
          amountBoosted: boostedAmount,
          tokenOffset: tokenOffset
        }
      });

      const updates = {
        attackedTokens: { increment: attackedTokens },
        defendedTokens: { increment: defendedTokens },
        eventIndexed: event.eventId
      };

      await this.context.prisma.desiege.upsert({
        where: { gameId },
        update: updates,
        create: {
          gameId,
          ...updates,
          defendedTokens,
          attackedTokens
        }
      });
    } catch (e) {
      console.error(`Error indexing updating game: ${gameId}`);
      throw e;
    }
  }

  async inflictDamage(event: Event): Promise<void> {
    const params = event.parameters ?? [];
    const gameId = parseInt(params[0]);
    try {
      const damageAmount = parseInt(params[2]);

      const updates = {
        damageInflicted: { increment: damageAmount },
        eventIndexed: event.eventId
      };
      await this.context.prisma.desiege.upsert({
        where: { gameId },
        update: updates,
        create: {
          gameId,
          ...updates,
          damageInflicted: damageAmount
        }
      });
    } catch (e) {
      console.error(`Error indexing inflict damage on game: ${gameId}`);
      throw e;
    }
  }

  async getGameVariables() {
    const varList = await this.contract.get_game_context_variables();
    return {
      gameIdx: toBN(varList[0]).toNumber(),
      blocksPerMinute: toBN(varList[1]).toNumber(),
      hoursPerGame: toBN(varList[2]).toNumber(),
      currentBlock: toBN(varList[3]),
      gameStartBlock: toBN(varList[4]),
      mainHealth: toBN(varList[5]),
      currentBoost: toBN(varList[6]).toNumber()
    };
  }
}
