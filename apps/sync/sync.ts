import "dotenv/config";
import { connectToDatabase, CustomerService } from "../../libs/db";

(async () => {
  const client = await connectToDatabase();
  const customerService = new CustomerService(client);

  const changeStream = customerService.getChangeStream();

  console.log("Listening for changes to the customers collection...");
  changeStream.on("change", (change) => {
    console.log("Change detected:", change);
  });
})();
