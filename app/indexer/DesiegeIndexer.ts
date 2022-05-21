import { Event } from "../entities/starknet/Event";
import { Context } from "../context";
import { Indexer } from "./../types";
import { BigNumber } from "ethers";
import { hash } from "starknet";
import { Contract } from "starknet";
import TowerDefenceABI from "../abis/01_TowerDefence.json";
import { toBN } from "starknet/utils/number";

// Events
const GAME_STARTED_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("game_started")
).toHexString();

const GAME_ACTION_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("game_action")
).toHexString();

const TOWER_DAMAGE_INFLICTED_SELECTOR = BigNumber.from(
  hash.getSelectorFromName("tower_damage_inflicted")
).toHexString();

export default class DesiegeIndexer implements Indexer<Event> {
  private CONTRACTS = [
    "0x61756c424c781388f8908e02c97e31574a0fed80a9561fa025fb74140f79470",
  ];
  private context: Context;
  private contract: Contract = new Contract(
    TowerDefenceABI as any,
    this.CONTRACTS[0]
  );

  constructor(context: Context) {
    this.context = context;
  }

  contracts(): string[] {
    return this.CONTRACTS;
  }

  eventName(selector: string): string {
    const eventSelector = BigNumber.from(selector).toHexString();
    switch (eventSelector) {
      case GAME_STARTED_SELECTOR:
        return "game_started";
      case GAME_ACTION_SELECTOR:
        return "game_action";
      case TOWER_DAMAGE_INFLICTED_SELECTOR:
        return "tower_damage_inflicted";
      default:
        return "";
    }
  }

  async index(events: Event[]): Promise<void> {
    try {
      let lastIndexedEventId = await this.lastIndexId();
      for (const event of events) {
        const eventId = event.eventId;
        if (eventId <= lastIndexedEventId) {
          continue;
        }
        const params = event.parameters ?? [];
        const gameId = parseInt(params[0]);
        const eventName = this.eventName(event.keys[0]);
        const isGameAction = eventName === "game_action";
        const isGameStart = eventName === "game_started";
        const isDamageAction = eventName === "tower_damage_inflicted";

        const tokenOffset = isGameAction ? parseInt(params[2]) : 0;
        const tokenAmount = isGameAction ? parseInt(params[3]) : 0;
        const boostedAmount = isGameAction ? parseInt(params[4]) : 0;
        const damageAmount = isDamageAction ? parseInt(params[2]) : 0;
        const account = isGameAction
          ? BigNumber.from(params[6]).toHexString()
          : "";
        const attackedTokens = tokenOffset === 2 ? tokenAmount : 0;
        const defendedTokens = tokenOffset === 1 ? tokenAmount : 0;
        const winner = 0;
        let startedOn;
        let initialHealth;
        let startBlock;
        let endBlock;
        if (isGameStart) {
          startedOn = event.timestamp;
          initialHealth = parseInt(params[1]);
          startBlock = event.blockNumber;
          try {
            const gameCtx = await this.getGameVariables();
            endBlock =
              startBlock + 60 * gameCtx.hoursPerGame * gameCtx.blocksPerMinute;
          } catch (e) {
            console.error(e);
          }
        }

        if (isGameAction) {
          await this.context.prisma.desiegeAction.create({
            data: {
              gameId,
              account,
              amount: tokenAmount,
              amountBoosted: boostedAmount,
              tokenOffset: tokenOffset,
            },
          });
        }

        const updates = {
          attackedTokens: isGameAction
            ? { increment: attackedTokens }
            : attackedTokens,
          defendedTokens: isGameAction
            ? { increment: defendedTokens }
            : defendedTokens,
          damageInflicted: isDamageAction
            ? { increment: damageAmount }
            : damageAmount,
          eventIndexed: event.eventId,
          winner,
          startedOn,
          initialHealth,
          startBlock,
          endBlock,
        };
        await this.context.prisma.desiege.upsert({
          where: {
            gameId,
          },
          update: updates,
          create: {
            gameId,
            ...updates,
            damageInflicted: damageAmount,
            defendedTokens,
            attackedTokens,
          },
        });

        lastIndexedEventId = event.eventId;
      }
    } catch (e) {
      console.log(e);
    }
    return;
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
      currentBoost: toBN(varList[6]).toNumber(),
    };
  }

  async lastIndexId(): Promise<string> {
    const desiege = await this.context.prisma.desiege.findFirst({
      orderBy: {
        eventIndexed: "desc",
      },
    });
    return desiege?.eventIndexed ?? "";
  }
}
