import { context } from "../context";
import DesiegeIndexer from "./DesiegeIndexer";
import LoreIndexer from "./LoreIndexer";
import RealmsL2Indexer from "./RealmsL2Indexer";
import StarknetIndexer from "./StarknetIndexer";

export const StarkNet = () => {
  return {
    async serverWillStart() {
      const indexer = new StarknetIndexer(
        [
          new DesiegeIndexer(context),
          new LoreIndexer(context),
          new RealmsL2Indexer(context)
        ],
        context
      );
      await indexer.start();
    }
  };
};
