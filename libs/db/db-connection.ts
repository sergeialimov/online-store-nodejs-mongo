import { MongoClient } from "mongodb";

const DB_URI = process.env.DB_URI;

export const connectToDatabase = async () => {
  if (!DB_URI) {
    throw new Error(
      "Please define the DB_URI environment variable inside .env config",
    );
  }
  const client = new MongoClient(DB_URI);

  await client.connect();
  console.log("Connected to MongoDB");

  return client;
};

export const disconnectFromDatabase = async (client: MongoClient | null) => {
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
