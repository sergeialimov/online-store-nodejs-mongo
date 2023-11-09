import { MongoClient } from "mongodb";
import 'dotenv/config';
import { getCustomers } from "./faker.util";
import CustomerService from "../../libs/db/services/customer.service";
import { connectToDatabase } from "../../libs/db/d"; // disconnectFromDatabase

(async () => {
  let client: MongoClient;
  try {
    client = await connectToDatabase();
    const customerService = new CustomerService(client);
    const interval = 200;

    const insertCustomersRepeatedly = async () => {
      try {
        const amount = Math.floor(Math.random() * 10) + 1;
        const customers = getCustomers(amount);
        console.log("-- Inserting amount:", amount);

        await customerService.createCustomers(customers);

        setTimeout(insertCustomersRepeatedly, interval);
      } catch (error) {
        console.error("Error inserting customers:", error);
        // Continue the process even in the case of an error
        setTimeout(insertCustomersRepeatedly, interval);
      }
    };

    insertCustomersRepeatedly();
  } catch (err) {
    console.error("Startup error:", err);
    // await disconnectFromDatabase(client);
  }
})();
