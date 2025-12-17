import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MockModule } from '../../mockRepos/mocks.module';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockModule],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return all user data', async () => {
    const users = [{ email: '', fullName: '', id: 1, username: '' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(users);
    const resUsers = await controller.findAll();
    expect(resUsers).toBe<User[]>(users);
  });

  it('should return one user data', async () => {
    const user = { email: '', fullName: '', id: 1, username: '' };
    jest.spyOn(service, 'findOne').mockResolvedValue(user);
    const resUsers = await controller.findOne('');
    expect(resUsers).toBe<User>(user);
  });
});
