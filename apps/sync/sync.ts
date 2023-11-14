import "dotenv/config";
import {
  connectToDatabase,
  CustomerService,
  AnonymisedCustomerService,
} from "../../libs/db";

import { realTimeSync } from "./realtime-sync";
import { fullReindex } from "./full-reindex";

const fullReindexOption = "--full-reindex";

(async () => {
  const args = process.argv.slice(2);

  const client = await connectToDatabase();
  const customerService = new CustomerService(client);
  const anonymisedCustomerService = new AnonymisedCustomerService(client);

  if (args.includes(fullReindexOption)) {
    await fullReindex(customerService, anonymisedCustomerService);
  } else {
    await realTimeSync(customerService, anonymisedCustomerService);
  }
})();
