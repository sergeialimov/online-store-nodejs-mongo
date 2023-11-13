# Online store app

## Description:

Online store application including:

1. StoreApp
2. SyncApp
3. Db lib

## Setting up
1. Clone the repo

2. Install dependencies
   `yarn install`

3. Set env variables in .env file
   `DB_URI=mongodb://127.0.0.1:27017/fund?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2`

4. Update mongod.conf with
    ```
    replication:
      replSetName: "rs0"
    ```

## Launching
1. Run the StoreApp
   `npx ts-node apps/app.ts`

2. Run the SyncApp
   `npx ts-node apps/sync/sync.ts`
