// db.ts can also be the same in both applications, managing the database connection logic.
import { MongoClient } from 'mongodb';
import DB_CONFIG from './dbConfig';

const client = new MongoClient(DB_CONFIG.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const connectToDatabase = async () => {
  if (!client.isConnected()) {
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client.db(DB_CONFIG.dbName);
};

export const disconnectFromDatabase = async () => {
  if (client.isConnected()) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
};
