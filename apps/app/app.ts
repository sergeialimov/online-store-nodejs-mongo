import { MongoClient } from "mongodb";
import "dotenv/config";
import { createRandomCustomers } from "../../shared/utils";
import {
  CustomerService,
  connectToDatabase,
  disconnectFromDatabase,
} from "../../libs/db/";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

        await delay(interval);
      } catch (error) {
        console.error("Error inserting customers:", error);
        await delay(interval);
      }
    }
  } catch (err) {
    console.error("Startup error:", err);
    if (client) {
      await disconnectFromDatabase(client);
    }
  }
})();
