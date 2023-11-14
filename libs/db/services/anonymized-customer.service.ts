import { MongoClient, Collection } from "mongodb";
import { AnonymizedCustomer } from "../models";

export class AnonymizedCustomerService {
  private dbClient: MongoClient;
  private collection: Collection<AnonymizedCustomer>;

  constructor(dbClient: MongoClient) {
    this.dbClient = dbClient;
    this.collection = this.dbClient.db().collection("customers_anonymized");
  }

  public async upsertBatch(batch: AnonymizedCustomer[]): Promise<void> {
    const bulkOps = batch.map(doc => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true
      }
    }));

    await this.collection.bulkWrite(bulkOps);
  }
}
