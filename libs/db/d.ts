import { MongoClient } from "mongodb";

const DB_URI = process.env.DB_URI;

export const connectToDatabase = async () => {
  if (!DB_URI) {
    throw new Error("Please define the DB_URI environment variable inside .env.local");
  }
  const client = new MongoClient(DB_URI);

  await client.connect();
  console.log("Connected to MongoDB");

  return client;
};
