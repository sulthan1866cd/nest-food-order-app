import { randomInt, randomUUID } from 'crypto';
import { Role } from 'src/gurds/role.enum';
import { User } from 'src/modules/users/entities/user.entity';

export const mockUsers: User[] = [
  {
    id: randomUUID(),
    username: 'ironwolf',
    password: 'ironwolf1',
    fullName: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    role: Role.CUSTOMER,
  },
  {
    id: randomUUID(),
    username: 'skyhawk',
    password: 'skyhawk2',
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    role: Role.ADMIN,
  },
  {
    id: randomUUID(),
    username: 'nightcoder',
    password: 'nightcoder3',
    fullName: 'Rohit Sharma',
    email: 'rohit.sharma@example.com',
    role: Role.CHEF,
  },
  {
    id: randomUUID(),
    username: 'pixelqueen',
    password: 'pixelqueen4',
    fullName: 'Sara Thomas',
    email: 'sara.thomas@example.com',
    role: Role.CHEF,
  },
  {
    id: randomUUID(),
    username: 'bytecrunch',
    password: 'bytecrunch5',
    fullName: 'Kavin Reddy',
    email: 'kavin.reddy@example.com',
    role: Role.CUSTOMER,
  },
];

export const getMockUser = (): User =>
  mockUsers[randomInt(mockUsers.length - 1)];
