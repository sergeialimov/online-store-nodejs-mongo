import {
  AnonymisedCustomerService,
  CustomerService,
  AnonymisedCustomer,
} from "../../libs/db";

import {
  saveResumeToken,
  getResumeToken,
  anonymiseCustomer,
} from "../../shared/utils";

import { SYNC_BATCH_SIZE } from "./constants";

export async function fullReindex(
  customerService: CustomerService,
  anonymisedCustomerService: AnonymisedCustomerService,
) {
  try {
    console.log("Full reindexing started");
    const cursor = customerService.getCustomersCursor(SYNC_BATCH_SIZE);

    let batch: AnonymisedCustomer[] = [];

    while (await cursor.hasNext()) {
      const customer = await cursor.next();
      if (customer) {
        batch.push(anonymiseCustomer(customer));

        if (batch.length === SYNC_BATCH_SIZE) {
          await anonymisedCustomerService.upsertBatch(batch);
          batch = [];
        }
      }
    }

    // Insert any remaining customers in the last batch
    if (batch.length > 0) {
      await anonymisedCustomerService.upsertBatch(batch);
    }

    console.log("Full reindexing completed");
  } catch (error) {
    console.error("Error occurred during full reindexing:", error);
  } finally {
    console.log("Exiting the full reindexing process");
  }
}
