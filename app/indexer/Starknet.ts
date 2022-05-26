import { context } from "../context";
import DesiegeIndexer from "./DesiegeIndexer";
import LoreIndexer from "./LoreIndexer";
import RealmsBuildingIndexer from "./RealmsBuildingIndexer";
import RealmsL2Indexer from "./RealmsL2Indexer";
import RealmsResourceIndexer from "./RealmsResourceIndexer";
import StarknetIndexer from "./StarknetIndexer";
import RealmsTroopsIndexer from "./RealmsTroopsIndexer";
import ExchangeIndexer from "./ExchangeIndexer";

export const StarkNet = () => {
  return {
    async serverWillStart() {
      const indexer = new StarknetIndexer(
        [
          new DesiegeIndexer(context),
          new LoreIndexer(context),
          new RealmsL2Indexer(context),
          new RealmsResourceIndexer(context),
          new RealmsBuildingIndexer(context),
          new RealmsTroopsIndexer(context),
          new ExchangeIndexer(context)
        ],
        context
      );
      await indexer.start();
    }
  };
};
