import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseMockRepository } from './baseMockRepo';

@Injectable()
export class UserMockRepository extends BaseMockRepository<User> {
  constructor() {
    super(
      Promise.resolve([
        {
          id: 1,
          username: 'ironwolf',
          fullName: 'Arjun Mehta',
          email: 'arjun.mehta@example.com',
        },
        {
          id: 2,
          username: 'skyhawk',
          fullName: 'Priya Nair',
          email: 'priya.nair@example.com',
        },
        {
          id: 3,
          username: 'nightcoder',
          fullName: 'Rohit Sharma',
          email: 'rohit.sharma@example.com',
        },
        {
          id: 4,
          username: 'pixelqueen',
          fullName: 'Sara Thomas',
          email: 'sara.thomas@example.com',
        },
        {
          id: 5,
          username: 'bytecrunch',
          fullName: 'Kavin Reddy',
          email: 'kavin.reddy@example.com',
        },
      ]),
    );
  }
}
