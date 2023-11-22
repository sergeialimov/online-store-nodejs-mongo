import { setTimeout } from "timers/promises";
import "dotenv/config";
import { createRandomCustomers } from "../../shared/utils";
import { CUSTOMERS_AMOUNT, TIMEOUT_INTERVAL } from "./constants";
import {
  CustomerService,
  connectToDatabase,
  disconnectFromDatabase,
  DbClient,
} from "../../libs/db/";



(async () => {
  let client: DbClient | null = null;
  try {
    client = await connectToDatabase();
    if (!client) {
      throw new Error("Failed to connect to database");
    }
    const customerService = new CustomerService(client);

    for (;;) {
      const amount = Math.floor(Math.random() * CUSTOMERS_AMOUNT) + 1;
      const customers = createRandomCustomers(amount);

      await customerService.createCustomers(customers);
    }
  } catch (err) {
    console.error("Application error:", err);
    if (client) {
      await disconnectFromDatabase(client);
    }
    process.exit(1);
  }

  await setTimeout(TIMEOUT_INTERVAL);
})();
