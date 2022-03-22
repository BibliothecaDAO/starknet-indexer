import { context } from "../context";

import { WalletResolver } from "../resolvers";
import { wallet } from "../db/testDB";
import DesiegeIndexer from "./DesiegeIndexer";
import StarknetIndexer from "./StarknetIndexer";

const Wallet = new WalletResolver();

const mockDB = async () => {
  try {
    await Wallet.createOrUpdateWallet(
      {
        address: wallet.address
      },
      context
    );
  } catch (e) {
    console.error(e);
  }
};

export const StarkNet = () => {
  return {
    async serverWillStart() {
      await mockDB;

      const indexer = new StarknetIndexer(
        [new DesiegeIndexer(context)],
        context
      );
      await indexer.start();
    }
  };
};
