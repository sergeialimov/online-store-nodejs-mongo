import "dotenv/config";
import {
  connectToDatabase,
  CustomerService,
  AnonymizedCustomerService,
} from "../../libs/db";

import { realTimeSync } from "./realtime-sync";
import { fullReindex } from "./full-reindex";

const fullReindexOption = "--full-reindex";

(async () => {
  const args = process.argv.slice(2);

  const client = await connectToDatabase();
  const customerService = new CustomerService(client);
  const anonymizedCustomerService = new AnonymizedCustomerService(client);

  if (args.includes(fullReindexOption)) {
    await fullReindex(customerService, anonymizedCustomerService);
  } else {
    await realTimeSync(customerService, anonymizedCustomerService);
  }
})();
