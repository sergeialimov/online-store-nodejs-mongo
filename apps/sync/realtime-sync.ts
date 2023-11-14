import {
  AnonymizedCustomer,
  CustomerService,
  AnonymizedCustomerService,
} from "../../libs/db";

import {
  saveResumeToken,
  getResumeToken,
  anonymizeCustomer,
} from "../../shared/utils";

const RESUME_TOKEN_PATH = "apps/sync/resume-token.txt";
const batchLength = 1000;
const batchInterval = 1000;

export async function realTimeSync(
  customerService: CustomerService,
  anonymizedCustomerService: AnonymizedCustomerService,
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

      let batch: AnonymizedCustomer[] = [];
      let batchTimer: NodeJS.Timeout | null = null;
      const resumeToken = JSON.stringify(change._id);
      const anonymizedData = anonymizeCustomer(change.fullDocument);
      batch.push(anonymizedData);

      if (batch.length === batchLength) {
        await anonymizedCustomerService.insertBatch(batch);
        batch = [];
        if (batchTimer) {
          clearTimeout(batchTimer);
        }
        await saveResumeToken(RESUME_TOKEN_PATH, resumeToken);
      } else if (!batchTimer) {
        batchTimer = setTimeout(async () => {
          await anonymizedCustomerService.insertBatch(batch);
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
