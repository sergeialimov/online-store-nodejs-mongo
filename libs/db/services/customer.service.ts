import { Collection, MongoClient, ChangeStream } from "mongodb";
import { Customer } from "../models";

export class CustomerService {
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
      console.log(
        `Inserted ${insertResult.insertedCount} customers into the collection`
      );
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }

  public getChangeStream(): ChangeStream<Customer> {
    return this.collection.watch();
  }
}

export default CustomerService;
