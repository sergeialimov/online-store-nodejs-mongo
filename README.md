# Online store app

This suite comprises two applications designed for a MongoDB-backed internet shop to handle customer data securely and efficiently. One application simulates the shop's operations by generating customers, while the other synchronizes this data, ensuring privacy through anonymisation.

## Applications Overview

### `app.ts` - Shop Simulation

This application simulates the ongoing operations of an online shop.

- **Continuous Customer Generation**: It perpetually generates customer data and inserts it into the MongoDB database.
- **Randomized Batch Generation**: Utilizes the **[Faker](https://www.npmjs.com/package/@faker-js/faker)** library to create batches of 1-10 customers every 200 milliseconds.
- **Data Insertion**: Inserts these customer batches into the `customers` collection in MongoDB.

### `sync.ts` - Data Synchronization and Anonymisation

This application focuses on data synchronization and anonymisation.

- **Change Listening**: Monitors the `customers` collection for new entries and modifications.
- **Data Anonymisation**: Anonymises sensitive fields like `firstName`, `lastName`, `email`, `address.line1`, `address.line2`, and `postcode` with a pseudorandom, deterministic sequence of characters.
- **Batch Processing**: Accumulates 1,000 documents per batch for processing. If a batch isn't filled within 1 second, it processes whatever is available.
- **Resumption Capability**: Capable of resuming from the last processed state in case of a restart, ensuring no data changes are missed.
- **Operational Modes**:
  - **Real-time Synchronization**: Default mode, activated when run without arguments.
  - **Full Reindexing**: Activated with the `--full-reindex` flag. In this mode, the application performs a complete transfer and anonymisation of all data in batches of 1,000 documents. Exits with code `0` upon successful completion.
- **Parallel Operation**: Both real-time and full reindexing modes can operate simultaneously.

### Prerequisites

- Node.js (version 12 or higher)
- MongoDB (version 4.0 or higher)
- A MongoDB database with a `customers` and `customers_anonymised` collection

### Installation and Configuration

1. Clone the repository:
   git clone [https://github.com/sergeialimov/online-store]

2. Navigate to the project directory and install dependencies:

   ```
   yarn install
   ```

3. Create a `.env` file in the root with the necessary configurations (e.g., `DB_URI`).

   ```
   DB_URI=mongodb://127.0.0.1:27017/fund?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2
   ```

4. Update `mongod.conf` with
   ```
   replication:
     replSetName: "rs0"
   ```

### Usage

1. Run `app.ts` for the shop simulation:

   ```
   yarn run-app
   ```

2. Run `sync.ts` for data synchronization and anonymisation:

- For real-time synchronization:

   ```
   yarn run-sync
   ```

- For full reindexing:
  ```
  yarn run-sync-reindex
  ```
