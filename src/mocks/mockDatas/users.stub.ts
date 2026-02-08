import { randomInt, randomUUID } from 'crypto';
import { Role } from 'src/guards/role.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { getMockMall } from './malls.stub';
import { getMockShop } from './shops.stub';

export const mockUsers: User[] = [
  {
    id: randomUUID(),
    username: 'admin',
    password: '$2a$12$OBIkThc5UVO9iumIwRDzhe4C/4JroXaSSXs3DVnaRIrZdIROfwkVm', // original password: ironwolf1
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: Role.SUPER_ADMIN,
  },
  {
    id: randomUUID(),
    username: 'ironwolf',
    password: '$2a$12$NvQP4dNbkM5vw2lsYRefm.WdYZAw9OeDEktN4NVOYXlfb7UYQcuA2', // original password: ironwolf1
    fullName: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    role: Role.CUSTOMER,
  },
  {
    id: randomUUID(),
    username: 'skyhawk',
    password: '$2a$12$ZLg9kdVm3yLcMfIAQKOa5Ooz4zZI/FPULnS/RdJwqIRIEik.leHoq', // original password: skyhawk2
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    role: Role.ADMIN,
    mallId: getMockMall().id,
  },
  {
    id: randomUUID(),
    username: 'nightcoder',
    password: '$2a$12$.tFazz2iwWMSWS5Ty1S/b.FILAs8DTV36f0ZDkLH2k2ih.0S1C7iO', // original password: nightcoder3
    fullName: 'Rohit Sharma',
    email: 'rohit.sharma@example.com',
    role: Role.WORKER,
    ...(() => {
      const shop = getMockShop();
      return {
        shopId: shop.id,
        mallId: shop.mallId,
      };
    })(),
  },
  {
    id: randomUUID(),
    username: 'pixelqueen',
    password: '$2a$12$SovzyWZlrxiRHHewP/jMiuvdZ/eZsZWzrZj44bDRFkpLnXu8F3ZGm', // original password: pixelqueen4
    fullName: 'Sara Thomas',
    email: 'sara.thomas@example.com',
    role: Role.WORKER,
    ...(() => {
      const shop = getMockShop();
      return {
        shopId: shop.id,
        mallId: shop.mallId,
      };
    })(),
  },
  {
    id: randomUUID(),
    username: 'bytecrunch',
    password: '$2a$12$4adIWGhUUg0I07SqQF98d.yGlS1A4ly7puBryJOiKuJX0.DsuYB1a', // original password: bytecrunch5
    fullName: 'Kavin Reddy',
    email: 'kavin.reddy@example.com',
    role: Role.CUSTOMER,
  },
];

export const getOriginalPassword = (username: string): string => {
  const passwords = [
    { username: 'admin', password: 'ironwolf1' },
    { username: 'ironwolf', password: 'ironwolf1' },
    { username: 'skyhawk', password: 'skyhawk2' },
    { username: 'nightcoder', password: 'nightcoder3' },
    { username: 'pixelqueen', password: 'pixelqueen4' },
    { username: 'bytecrunch', password: 'bytecrunch5' },
  ];
  const user = passwords.find((user) => user.username === username);
  return user ? user.password : 'null';
};

export const getMockUser = (): User =>
  mockUsers[randomInt(mockUsers.length - 1)];
