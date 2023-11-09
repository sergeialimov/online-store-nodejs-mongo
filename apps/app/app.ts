import { getCustomers } from './faker.util';


(async () => {
  await import('dotenv/config');

  setInterval(() => {
    const amount = Math.floor(Math.random() * 10) + 1;
    const customers = getCustomers(amount);
    console.log('-- amount', amount);
  }, 200);

})();
