import "dotenv/config";

import { realTimeSync } from "./realtime-sync";
import { fullReindex } from "./full-reindex";
import { FULL_REINDEX_OPTION } from "./constants";

(async () => {
  try {
    const args = process.argv.slice(2);

    if (args.includes(FULL_REINDEX_OPTION)) {
      await fullReindex();
    } else {
      await realTimeSync();
    }
  } catch (error) {
    console.error("Error occurred:", error);
    process.exit(1);
  }
})();
