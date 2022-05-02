import { context } from "../context";
import DesiegeIndexer from "./DesiegeIndexer";
import LoreIndexer from "./LoreIndexer";
import StarknetIndexer from "./StarknetIndexer";

export const StarkNet = () => {
  return {
    async serverWillStart() {
      const indexer = new StarknetIndexer(
        [new DesiegeIndexer(context), new LoreIndexer(context)],
        context
      );
      await indexer.start();
    }
  };
};
