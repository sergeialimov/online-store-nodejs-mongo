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

const RESUME_TOKEN_PATH = "apps/sync/resume-token.txt";
const batchLength = 1000;
const batchInterval = 1000;

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

      if (batch.length === batchLength) {
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
        }, batchInterval);
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
