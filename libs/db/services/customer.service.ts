

export async function createCustomer(customer: Omit<Customer, '_id' | 'createdAt'>) {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    
    // Get the customers collection
    const collection = db.collection<Customer>('customers');
    
    // Insert a customer into the collection
    const insertResult = await collection.insertOne({
      ...customer,
      _id: new ObjectId(), // This is usually not necessary as MongoDB will generate an ID
      createdAt: new Date() // Assign the current date on creation
    });
    console.log('Inserted documents =>', insertResult);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}