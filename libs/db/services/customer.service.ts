import {
  Collection,
  MongoClient,
  ResumeToken,
  ChangeStream,
  ChangeStreamDocument,
} from "mongodb";
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
    const bulkOps = customers.map((customer) => ({
      updateOne: {
        filter: { email: customer.email },
        update: { $set: customer },
        upsert: true,
      },
    }));

    const result = await this.collection.bulkWrite(bulkOps, {
      ordered: false,
    });

    logInsertedCustomers(result.modifiedCount + result.upsertedCount);
  }

  public getChangeStream(resumeToken: ResumeToken): ChangeStream<Customer> {
    const options = resumeToken ? { resumeAfter: resumeToken } : {};
    return this.collection.watch([], options);
  }

  public isInsertReplaceOrUpdate(
    change: ChangeStreamDocument<Customer>,
  ): change is ChangeStreamDocument<Customer> & { fullDocument: Customer } {
    return (
      change.operationType === "insert" ||
      change.operationType === "replace" ||
      change.operationType === "update"
    );
  }

  public getCustomersCursor(batchSize: number) {
    return this.collection.find().sort({ _id: 1 }).batchSize(batchSize);
  }

  logInsertedCustomers(modifiedCount, upsertedCount) {
    console.log(
      `Processed ${
        modifiedCount + upsertedCount
      } customers (updated + upserted) into the collection`,
    );
  }
}

export default CustomerService;
