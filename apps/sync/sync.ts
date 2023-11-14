import "dotenv/config";
import {
  connectToDatabase,
  CustomerService,
  AnonymizedCustomerService,
} from "../../libs/db";

import { realTimeSync } from "./realtime-sync";
import { fullReindex } from "./full-reindex";

(async () => {
  const args = process.argv.slice(2);

  const client = await connectToDatabase();
  const customerService = new CustomerService(client);
  const anonymizedCustomerService = new AnonymizedCustomerService(client);

  if (args.includes("--full-reindex")) {
    await fullReindex(customerService, anonymizedCustomerService);
  } else {
    await realTimeSync(customerService, anonymizedCustomerService);
  }
})();
