import { faker } from '@faker-js/faker';
import { randomInt, randomUUID } from 'crypto';
import { Mall } from 'src/modules/malls/entities/mall.entity';

export const mockMalls: Mall[] = Array.from({ length: 5 }, () => ({
  id: randomUUID(),
  location: faker.location.streetAddress(),
  name: faker.location.streetAddress(),
}));

export const getMockMall = (): Mall =>
  mockMalls[randomInt(mockMalls.length - 1)];
