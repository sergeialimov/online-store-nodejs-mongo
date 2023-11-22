import { MongoClient } from "mongodb";
import { setTimeout } from "timers/promises";

const DB_URI = process.env.DB_URI;


export const connectToDatabase = async (retries = 5): Promise<MongoClient> => {
  if (!DB_URI) {
    throw new Error("Please define the DB_URI environment variable inside .env config");
  }

  try {
    const client = new MongoClient(DB_URI, {});
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Connection failed, retrying...", error);
    if (retries > 0) {
      await setTimeout(1000);
      return connectToDatabase(retries - 1);
    } else {
      throw new Error(`All retries failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

export const disconnectFromDatabase = async (client: MongoClient | null): Promise<void> => {
  if (client) {
    try {
      await client.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error while disconnecting:", error);
    }
  }
};

export { MongoClient as DbClient };
