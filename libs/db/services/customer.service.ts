import { Collection, MongoClient, ResumeToken, ChangeStream } from "mongodb";
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
        `Inserted ${insertResult.insertedCount} customers into the collection`,
      );
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }

  public getChangeStream(resumeToken: ResumeToken): ChangeStream<Customer> {
    if (!resumeToken) {
      return this.collection.watch();
    }
    return this.collection.watch([], { resumeAfter: resumeToken });
  }
}

export default CustomerService;
