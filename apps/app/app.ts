import { MongoClient } from "mongodb";
import { setTimeout } from "timers/promises";
import "dotenv/config";
import { createRandomCustomers } from "../../shared/utils";
import { CUSTOMERS_AMOUNT, TIMEOUT_INTERVAL } from "./constants";
import {
  CustomerService,
  connectToDatabase,
  disconnectFromDatabase,
} from "../../libs/db/";

(async () => {
  let client: MongoClient | null = null;
  try {
    client = await connectToDatabase();
    const customerService = new CustomerService(client);

    for (;;) {
      try {
        const amount = Math.floor(Math.random() * CUSTOMERS_AMOUNT) + 1;
        const customers = createRandomCustomers(amount);

        await customerService.createCustomers(customers);

        await setTimeout(TIMEOUT_INTERVAL);
      } catch (error) {
        console.error("Error inserting customers:", error);
        await setTimeout(TIMEOUT_INTERVAL);
      }
    }
  } catch (err) {
    console.error("Startup error:", err);
    if (client) {
      await disconnectFromDatabase(client);
    }
  }
})();
