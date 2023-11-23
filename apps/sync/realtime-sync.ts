import { setTimeout } from "timers/promises";
import {
  connectToDatabase,
  disconnectFromDatabase,
  AnonymisedCustomer,
  CustomerService,
  AnonymisedCustomerService,
  DbClient,
} from "../../libs/db";

import {
  saveResumeToken,
  getResumeToken,
  anonymiseCustomer,
} from "../../shared/utils";

import { RESUME_TOKEN_PATH, BATCH_SIZE, TIMEOUT_INTERVAL } from "./constants";

export async function realTimeSync() {
  let client: DbClient | null = null;
  let changeStream;
  let batch: AnonymisedCustomer[] = [];
  let currentTimeoutId = 0;
  let timeoutReached = false;

  const processBatch = async (
    anonymisedCustomerService: AnonymisedCustomerService,
    resumeToken: string,
  ) => {
    if (batch.length > 0) {
      await anonymisedCustomerService.upsertBatch(batch);
      batch = [];
      await saveResumeToken(RESUME_TOKEN_PATH, resumeToken);
    }
  };

  const startTimeout = async () => {
    const thisTimeoutId = ++currentTimeoutId;
    timeoutReached = false;

    await setTimeout(TIMEOUT_INTERVAL);

    if (thisTimeoutId === currentTimeoutId) {
      timeoutReached = true;
    }
  };

  try {
    client = await connectToDatabase();
    const customerService = new CustomerService(client);
    const anonymisedCustomerService = new AnonymisedCustomerService(client);
    const lastToken = await getResumeToken(RESUME_TOKEN_PATH);
    changeStream = customerService.getChangeStream(lastToken);
    startTimeout();

    for await (const change of changeStream) {
      if (
        !customerService.isInsertReplaceOrUpdate(change) ||
        !change.fullDocument
      ) {
        continue;
      }

      if (timeoutReached || batch.length >= BATCH_SIZE) {
        const resumeToken = JSON.stringify(change._id);
        await processBatch(anonymisedCustomerService, resumeToken);
        timeoutReached = false;
        startTimeout();
      }

      batch.push(anonymiseCustomer(change.fullDocument));
    }
  } catch (error) {
    console.error("Error processing change stream:", error);
  } finally {
    if (changeStream) {
      await changeStream.close();
    }
    if (client) {
      await disconnectFromDatabase(client);
    }
  }
}
