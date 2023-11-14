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
  const cursor = customerService.getCustomersCursor(batchLength);

  let batch: AnonymizedCustomer[] = [];

  while (await cursor.hasNext()) {
    const customer = await cursor.next();
    if (customer) {
      batch.push(anonymizeCustomer(customer));

      if (batch.length === batchLength) {
        await anonymizedCustomerService.insertBatch(batch);
        batch = [];
      }
    }
  }

  // Insert any remaining customers in the last batch
  if (batch.length > 0) {
    await anonymizedCustomerService.insertBatch(batch);
  }

  console.log("Full reindexing completed");
  process.exit(0);
}
