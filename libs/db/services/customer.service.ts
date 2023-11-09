import { Collection, MongoClient } from "mongodb";
import { Customer } from "../models";

class CustomerService {
  private dbClient: MongoClient;
  private collection: Collection<Customer>;
  private readonly collectionName = "customers";

  constructor(dbClient: MongoClient) {
    this.dbClient = dbClient;
    this.collection = this.dbClient
      .db()
      .collection<Customer>(this.collectionName);
  }

  public async createCustomers(customers: Customer[]): Promise<void> {
    try {
      const insertResult = await this.collection.insertMany(customers);
      console.log("Inserted documents =>", insertResult);
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }
}

export default CustomerService;
