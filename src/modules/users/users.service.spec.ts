import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MockModule } from '../../mockRepos/mocks.module';
import { IRepository } from 'src/interface/repository.interface';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: IRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<IRepository<User>>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should update data if user exists', async () => {
    const users = [
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
    ];
    jest.spyOn(repository, 'findBy').mockResolvedValue(users);
    jest.spyOn(repository, 'update').mockResolvedValue(users[0]);
    const updatedUser = await service.update(users[0].username, users[0]);
    expect(updatedUser).not.toBe(null);
  });

  it('should not update data if user does not exists', async () => {
    const users = [
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
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(users);
    const updatedUser = await service.update('', {
      email: '',
      fullName: '',
      id: 11,
      username: '',
    });
    expect(updatedUser).toBe(null);
  });
});
