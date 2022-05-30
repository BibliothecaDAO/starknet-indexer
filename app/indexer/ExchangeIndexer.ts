import { Context } from "../context";
import BaseContractIndexer from "./BaseContractIndexer";
import { Contract } from "starknet";
import { bnToUint256, uint256ToBN } from "starknet/utils/uint256";
import ExchangeABI from "../abis/Exchange_ERC20_1155.json";

const CONTRACT =
  "0x040cfa14714dcd6899f034c4df8396c0b2851598a58d58846da05c5e7743cbfd";

const RESOURCE_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
];

const TOKEN_IDS = RESOURCE_IDS.map((resourceId) =>
  bnToUint256(String(resourceId))
);

const TOKEN_AMOUNTS = [...TOKEN_IDS].fill(
  bnToUint256(String(1e18)),
  0,
  TOKEN_IDS.length
);

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

  // TODO
  async addLiquidity() {}
  async removeLiquidity() {}
  async purchaseTokens() {}
  async purchaseCurrency() {}

  async fetchPrices() {
    if (this.isUpdatingPrices) {
      return;
    }

    this.isUpdatingPrices = true;

    try {
      const calls = [
        this.contract.get_all_rates(TOKEN_IDS, TOKEN_AMOUNTS),
        this.contract.get_all_buy_price(TOKEN_IDS, TOKEN_AMOUNTS),
        this.contract.get_all_sell_price(TOKEN_IDS, TOKEN_AMOUNTS)
      ];

      const [rates, buys, sells] = await Promise.all(calls);
      const today = new Date();
      const date = today.toISOString().split("T")[0];
      const hour = today.getUTCHours();

      const batchUpserts = RESOURCE_IDS.map((tokenId: number, idx: number) => {
        const amount = uint256ToBN(rates[0][idx]).toString();
        const buyAmount = uint256ToBN(buys[0][idx]).toString();
        const sellAmount = uint256ToBN(sells[0][idx]).toString();
        return this.context.prisma.exchangeRate.upsert({
          where: {
            date_hour_tokenId: {
              date,
              hour,
              tokenId
            }
          },
          update: { amount, buyAmount, sellAmount },
          create: {
            date,
            hour,
            tokenId,
            amount,
            buyAmount,
            sellAmount
          }
        });
      });

      await this.context.prisma.$transaction(batchUpserts);
    } catch (e) {
      console.error(e);
    }

    this.isUpdatingPrices = false;
  }
}
