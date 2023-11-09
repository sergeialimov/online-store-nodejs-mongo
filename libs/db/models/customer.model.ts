import { ObjectId } from 'mongodb';

export interface Address {
  line1: string;
  line2?: string; // line2 is optional
  postcode: string;
  city: string;
  state: string;
  country: string;
}

export interface Customer {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  createdAt?: Date;
}
