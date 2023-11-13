import { MongoClient, Collection } from "mongodb";
import { AnonymizedCustomer } from "../models";

export class AnonymizedCustomerService {
  private dbClient: MongoClient;
  private collection: Collection<AnonymizedCustomer>;

  constructor(dbClient: MongoClient) {
    this.dbClient = dbClient;
    this.collection = this.dbClient.db().collection("customers_anonymized");
  }

  public async insertBatch(batch: AnonymizedCustomer[]): Promise<void> {
    if (batch.length > 0) {
      await this.collection.insertMany(batch);
    }
  }
}
