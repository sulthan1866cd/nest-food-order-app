import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseMockRepository } from './baseMockRepo';
import { mockUsers } from '../mockDatas/users.stub';

@Injectable()
export class UserMockRepository extends BaseMockRepository<User> {
  constructor() {
    super(Promise.resolve(mockUsers));
  }
}
