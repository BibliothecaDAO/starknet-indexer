import { context } from "../context";
import DesiegeIndexer from "./DesiegeIndexer";
import StarknetIndexer from "./StarknetIndexer";

export const StarkNet = () => {
  return {
    async serverWillStart() {
      const indexer = new StarknetIndexer(
        [new DesiegeIndexer(context)],
        context
      );
      await indexer.start();
    }
  };
};
