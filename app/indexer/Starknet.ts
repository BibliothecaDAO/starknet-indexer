import { context } from "./../context";
// import DesiegeIndexer from "./desiege/DesiegeIndexer";
import LoreIndexer from "./lore/LoreIndexer";
import BuildingIndexer from "./settling/BuildingIndexer";
import RealmsL2Indexer from "./settling/RealmsL2Indexer";
import SRealmsIndexer from "./settling/SRealmsIndexer";
import ResourceIndexer from "./settling/ResourceIndexer";
import StarknetIndexer from "./StarknetIndexer";
import CombatIndexer from "./settling/CombatIndexer";
import ExchangeIndexer from "./settling/ExchangeIndexer";
import ResourceERC1155Indexer from "./settling/ResourceERC1155Indexer";
import SettlingIndexer from "./settling/SettlingIndexer";
import RelicIndexer from "./settling/RelicIndexer";
import TravelIndexer from "./settling/TravelIndexer";
import LordsIndexer from "./settling/LordsIndexer";
import CalculatorIndexer from "./settling/CalculatorIndexer";
import LaborIndexer from "./settling/LaborIndexer";
import BastionIndexer from "./settling/BastionIndexer";

// import FoodIndexer from "./settling/FoodIndexer";
// import GoblinIndexer from "./settling/GoblinIndexer";

export const StarkNet = () => {
  return {
    async serverWillStart() {
      const indexer = new StarknetIndexer(
        [
          //TODO: Reenable when Desiege when added back
          // new DesiegeIndexer(context),
          new LordsIndexer(context),
          new LoreIndexer(context),
          new RealmsL2Indexer(context),
          new CalculatorIndexer(context),
          new SRealmsIndexer(context),
          new ResourceIndexer(context),
          new BuildingIndexer(context),
          new RelicIndexer(context),
          new ExchangeIndexer(context),
          new ResourceERC1155Indexer(context),
          new SettlingIndexer(context),
          // new FoodIndexer(context),
          new LaborIndexer(context),
          new TravelIndexer(context),
          // Resource Events must be processed before combat events
          new CombatIndexer(context),
          //TODO: Renable when Goblins are added to combat v3
          // new GoblinIndexer(context)
          new BastionIndexer(context),
        ],
        context
      );
      await indexer.start();
    },
  };
};
