import { Context } from "./../../context";
import BaseContractIndexer from "./../BaseContractIndexer";
import { Contract } from "starknet";
import { bnToUint256, uint256ToBN } from "starknet/utils/uint256";
import ExchangeABI from "./../../abis/Exchange_ERC20_1155.json";
import { BigNumberish } from "starknet/utils/number";
import { BigNumber } from "ethers";
import { Event } from "./../../entities/starknet/Event";
import { formatEther } from "ethers/lib/utils";
import { ExchangeEventType } from "@prisma/client";

const CONTRACT =
  "0x04c906be925dac8f1accbbd074adf9f7d23cfe208ca326bc9c05cf4a664bfee2";

const RESOURCE_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  10000, 10001,
];

const TOKEN_IDS = RESOURCE_IDS.map((resourceId) =>
  bnToUint256(String(resourceId))
);

const TOKEN_AMOUNTS = [...TOKEN_IDS].fill(
  bnToUint256(String(1e18)),
  0,
  TOKEN_IDS.length
);

function arrayUInt256ToNumber([low, high]: any[]): number {
  return parseInt(uint256ToBN({ low, high }).toString());
}

function arrayUInt256ToBigNumber([low, high]: any[]): BigNumberish {
  return uint256ToBN({ low, high }).toString();
}

export default class ExchangeIndexer extends BaseContractIndexer {
  private contract: Contract;
  interval: NodeJS.Timer;
  isUpdatingPrices: boolean;

  constructor(context: Context) {
    super(context, CONTRACT);

    this.contract = new Contract(
      ExchangeABI as any,
      CONTRACT,
      context.provider
    );

    this.on("LiquidityAdded", this.addLiquidity.bind(this));
    this.on("LiquidityRemoved", this.removeLiquidity.bind(this));
    this.on("TokensPurchased", this.purchaseTokens.bind(this));
    this.on("CurrencyPurchased", this.purchaseCurrency.bind(this));

    this.interval = setInterval(this.fetchPrices.bind(this), 5000);
  }

  async addLiquidity(event: Event) {
    await this.updateExchange(ExchangeEventType.LiquidityAdded, event);
  }

  async removeLiquidity(event: Event) {
    await this.updateExchange(ExchangeEventType.LiquidityRemoved, event);
  }

  async purchaseTokens(event: Event) {
    await this.updateExchange(ExchangeEventType.TokensPurchased, event);
  }

  async purchaseCurrency(event: Event) {
    await this.updateExchange(ExchangeEventType.CurrencyPurchased, event);
  }

  async updateExchange(type: ExchangeEventType, event: Event) {
    const params = event.parameters ?? [];
    const eventId = event.eventId;
    const address = BigNumber.from(params[0]).toHexString();
    const currencyAmount = arrayUInt256ToBigNumber(params.slice(1, 3));
    const currencyAmountValue = formatEther(currencyAmount);
    const resourceId = arrayUInt256ToNumber(params.slice(3, 5));
    const resourceAmount = arrayUInt256ToBigNumber(params.slice(5, 7));
    const resourceAmountValue = formatEther(resourceAmount);
    const timestamp = event.timestamp;

    const updates = {
      type,
      address,
      resourceId,
      currencyAmount,
      currencyAmountValue,
      resourceAmount,
      resourceAmountValue,
      timestamp,
    };
    await this.context.prisma.exchangeEvent.upsert({
      where: { eventId },
      update: { ...updates },
      create: {
        eventId,
        ...updates,
      },
    });
  }

  async fetchPrices() {
    if (this.isUpdatingPrices) {
      return;
    }

    this.isUpdatingPrices = true;

    try {
      const calls = [
        this.contract.get_all_rates(TOKEN_IDS, TOKEN_AMOUNTS),
        this.contract.get_all_buy_price(TOKEN_IDS, TOKEN_AMOUNTS),
        this.contract.get_all_sell_price(TOKEN_IDS, TOKEN_AMOUNTS),
        this.contract.get_all_currency_reserves(TOKEN_IDS, TOKEN_AMOUNTS),
      ];

      const [rates, buys, sells, lps] = await Promise.all(calls);
      const today = new Date();
      const date = today.toISOString().split("T")[0];
      const hour = today.getUTCHours();

      const batchUpserts = RESOURCE_IDS.map((tokenId: number, idx: number) => {
        const amount = uint256ToBN(rates[0][idx]).toString();
        const buyAmount = uint256ToBN(buys[0][idx]).toString();
        const sellAmount = uint256ToBN(sells[0][idx]).toString();
        const currencyReserve = uint256ToBN(lps[0][idx]).toString();
        const tokenReserve = uint256ToBN(lps[1][idx]).toString();
        return this.context.prisma.exchangeRate.upsert({
          where: {
            date_hour_tokenId: {
              date,
              hour,
              tokenId,
            },
          },
          update: {
            amount,
            buyAmount,
            sellAmount,
            currencyReserve,
            tokenReserve,
          },
          create: {
            date,
            hour,
            tokenId,
            amount,
            buyAmount,
            sellAmount,
            currencyReserve,
            tokenReserve,
          },
        });
      });

      await this.context.prisma.$transaction(batchUpserts);
    } catch (e) {
      console.error(e);
    }

    this.isUpdatingPrices = false;
  }
}
