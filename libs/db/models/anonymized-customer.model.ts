import { ObjectId } from "mongodb";

export interface AnonymisedAddress {
  line1: string;
  line2?: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
}

export interface AnonymisedCustomer {
  _id?: ObjectId;
  firstName: string; // Anonymized
  lastName: string; // Anonymized
  email: string; // Partially anonymized — part before '@'
  address: AnonymisedAddress; // Partially anonymized — line1, line2, postcode
  createdAt: Date; // The creation date remains unchanged
}
