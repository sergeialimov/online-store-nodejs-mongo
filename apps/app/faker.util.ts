import { faker } from '@faker-js/faker';

function createRandomCustomer(): Customer {
  return {
    firstName: faker.person.firstName;
    firstName: faker.person.lastName;
    email: faker.internet.email;
    address: {
      line1: faker.location.streetAddress,
      line2: faker.location.streetAddress,
      postcode: faker.location.zipCode,
      city: faker.location.city,
      state: faker.location.state,
      country: faker.location.country,
    }
  }
}

export const Customers: Customer[] = faker.helpers.multiple(createRandomCustomer, {
  count: 5,
});