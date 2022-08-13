import { context } from "./../context";
import DesiegeIndexer from "./DesiegeIndexer";
import LoreIndexer from "./LoreIndexer";
import RealmsBuildingIndexer from "./RealmsBuildingIndexer";
import RealmsL2Indexer from "./RealmsL2Indexer";
import SRealmsIndexer from "./SRealmsIndexer";
import RealmsResourceIndexer from "./RealmsResourceIndexer";
import StarknetIndexer from "./StarknetIndexer";
import RealmsCombatIndexer from "./RealmsCombatIndexer";
import ExchangeIndexer from "./ExchangeIndexer";
import ResourceERC1155Indexer from "./ResourceERC1155Indexer";
import SettlingIndexer from "./SettlingIndexer";
import RelicIndexer from "./RelicIndexer";

export const StarkNet = () => {
  return {
    async serverWillStart() {
      const indexer = new StarknetIndexer(
        [
          new DesiegeIndexer(context),
          new LoreIndexer(context),
          new RealmsL2Indexer(context),
          new SRealmsIndexer(context),
          new RealmsResourceIndexer(context),
          new RealmsBuildingIndexer(context),
          new RelicIndexer(context),
          new ExchangeIndexer(context),
          new ResourceERC1155Indexer(context),
          new SettlingIndexer(context),
          // Resource Events must be processed before combat events
          new RealmsCombatIndexer(context)
        ],
        context
      );
      await indexer.start();
    }
  };
};
