import {
  AnonymisedCustomer,
  CustomerService,
  AnonymisedCustomerService,
} from "../../libs/db";

import {
  saveResumeToken,
  getResumeToken,
  anonymiseCustomer,
} from "../../shared/utils";

import {
  RESUME_TOKEN_PATH,
  BATCH_LENGTH,
  BATCH_INTERVAL,
} from "./constants";

export async function realTimeSync(
  customerService: CustomerService,
  anonymisedCustomerService: AnonymisedCustomerService,
) {
  let changeStream;
  try {
    const lastToken = await getResumeToken(RESUME_TOKEN_PATH);
    changeStream = customerService.getChangeStream(lastToken);
    for await (const change of changeStream) {
      if (!customerService.isInsertReplaceOrUpdate(change)) {
        continue;
      }

      if (!change.fullDocument) {
        continue;
      }

      let batch: AnonymisedCustomer[] = [];
      let batchTimer: NodeJS.Timeout | null = null;
      const resumeToken = JSON.stringify(change._id);
      const anonymisedData = anonymiseCustomer(change.fullDocument);
      batch.push(anonymisedData);

      if (batch.length === BATCH_LENGTH) {
        await anonymisedCustomerService.upsertBatch(batch);
        batch = [];
        if (batchTimer) {
          clearTimeout(batchTimer);
        }
        await saveResumeToken(RESUME_TOKEN_PATH, resumeToken);
      } else if (!batchTimer) {
        batchTimer = setTimeout(async () => {
          await anonymisedCustomerService.upsertBatch(batch);
          batch = [];
          await saveResumeToken(RESUME_TOKEN_PATH, resumeToken);
        }, BATCH_INTERVAL);
      }
    }
  } catch (error) {
    console.error("Error processing change stream:", error);
  } finally {
    if (changeStream) {
      await changeStream.close();
    }
  }
}
