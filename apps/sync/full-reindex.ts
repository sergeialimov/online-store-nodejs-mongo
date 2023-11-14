import {
  AnonymizedCustomerService,
  CustomerService,
  AnonymizedCustomer,
} from "../../libs/db";

import {
  saveResumeToken,
  getResumeToken,
  anonymizeCustomer,
} from "../../shared/utils";

const batchLength = 10000;

export async function fullReindex(
  customerService: CustomerService,
  anonymizedCustomerService: AnonymizedCustomerService,
) {
  console.log("Full reindexing started");
  const cursor = customerService.getCustomersCursor(batchLength);

  let batch: AnonymizedCustomer[] = [];

  while (await cursor.hasNext()) {
    const customer = await cursor.next();
    if (customer) {
      batch.push(anonymizeCustomer(customer));

      if (batch.length === batchLength) {
        await anonymizedCustomerService.upsertBatch(batch);
        console.log(`${batch.length} documents have been upserted`);
        batch = [];
      }
    }
  }

  // Insert any remaining customers in the last batch
  if (batch.length > 0) {
    await anonymizedCustomerService.upsertBatch(batch);
    console.log(`${batch.length} documents have been upserted`);
  }

  console.log("Full reindexing completed");
  process.exit(0);
}
