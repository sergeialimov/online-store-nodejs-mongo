import { MongoClient, Collection } from "mongodb";
import { AnonymisedCustomer } from "../models";

export class AnonymisedCustomerService {
  private dbClient: MongoClient;
  private collection: Collection<AnonymisedCustomer>;

  constructor(dbClient: MongoClient) {
    this.dbClient = dbClient;
    this.collection = this.dbClient.db().collection("customers_anonymised");
  }

  public async upsertBatch(batch: AnonymisedCustomer[]): Promise<void> {
    const bulkOps = batch.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true,
      },
    }));

    await this.collection.bulkWrite(bulkOps);
    console.log(`${bulkOps.length} document(s) have been upserted`);
  }
}
