import "dotenv/config";
import {
  connectToDatabase,
  CustomerService,
  AnonymisedCustomerService,
} from "../../libs/db";

import { realTimeSync } from "./realtime-sync";
import { fullReindex } from "./full-reindex";
import { FULL_REINDEX_OPTION } from './constants';

(async () => {
  try {
    const args = process.argv.slice(2);

    const client = await connectToDatabase();
    const customerService = new CustomerService(client);
    const anonymisedCustomerService = new AnonymisedCustomerService(client);

    if (args.includes(FULL_REINDEX_OPTION)) {
      await fullReindex(customerService, anonymisedCustomerService);
    } else {
      await realTimeSync(customerService, anonymisedCustomerService);
    }
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
})();
