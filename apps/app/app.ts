import { MongoClient } from "mongodb";
import { setTimeout } from "timers/promises";
import "dotenv/config";
import { createRandomCustomers } from "../../shared/utils";
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
    const interval = 200;

    for (;;) {
      try {
        const amount = Math.floor(Math.random() * 10) + 1;
        const customers = createRandomCustomers(amount);

        await customerService.createCustomers(customers);

        await setTimeout(interval);
      } catch (error) {
        console.error("Error inserting customers:", error);
        await setTimeout(interval);
      }
    }
  } catch (err) {
    console.error("Startup error:", err);
    if (client) {
      await disconnectFromDatabase(client);
    }
  }
})();
