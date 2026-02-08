import { faker } from '@faker-js/faker';
import { randomInt, randomUUID } from 'crypto';
import { Shop } from 'src/modules/shops/entities/shop.entity';
import { getMockMall } from './malls.stub';

export const mockShops: Shop[] = Array.from({ length: 10 }, () => {
  const mall = getMockMall();
  return {
    id: randomUUID(),
    name: faker.commerce.department(),
    location: `floor: ${faker.number.int(3)}`,
    mallId: mall.id,
    mall,
  };
});

export const getMockShop = (): Shop =>
  mockShops[randomInt(mockShops.length - 1)];
