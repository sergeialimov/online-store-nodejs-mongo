import { faker } from '@faker-js/faker';
import { Customer } from '../../libs/db';

function createRandomCustomer(): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    address: {
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
      postcode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
    }
  }
}

export function getCustomers (amount: number): Customer[] {
  return faker.helpers.multiple(
    createRandomCustomer,
    { count: amount }
  );
}