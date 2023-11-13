import "dotenv/config";
import {
  connectToDatabase,
  AnonymizedCustomer,
  CustomerService,
  AnonymizedCustomerService,
} from "../../libs/db";

import {
  saveResumeToken,
  getResumeToken,
  anonymizeCustomer,
} from "../../shared/utils";

(async () => {
  const client = await connectToDatabase();
  const customerService = new CustomerService(client);
  const anonymizedCustomerService = new AnonymizedCustomerService(client);
  const changeStream = customerService.getChangeStream();
  let batch: AnonymizedCustomer[] = [];
  let batchTimer: NodeJS.Timeout | null = null;

  try {
    const lastToken = await getResumeToken();
    if (lastToken) {
      changeStream.resumeAfter(lastToken);
    }

    for await (const change of changeStream) {
      const resumeToken = change._id;
      const anonymizedData = anonymizeCustomer(change.fullDocument);
      batch.push(anonymizedData);

      if (batch.length === 1000) {
        await anonymizedCustomerService.insertBatch(batch);
        batch = [];
        if (batchTimer) clearTimeout(batchTimer);
        await saveResumeToken(resumeToken);
      } else if (!batchTimer) {
        batchTimer = setTimeout(async () => {
          await anonymizedCustomerService.insertBatch(batch);
          batch = [];
          await saveResumeToken(resumeToken);
        }, 1000);
      }
    }
  } catch (error) {
    console.error("Error processing change stream:", error);
  } finally {
    changeStream.close();
  }
})();
