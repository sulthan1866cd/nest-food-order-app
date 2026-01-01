import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { UsersService } from './users.service';
import { MockModule } from '../../mocks/mocks.module';
import { User } from './entities/user.entity';
import { Role } from 'src/gurds/role.enum';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockModule],
      controllers: [CustomersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return all user data', () => {
    const users = [
      {
        email: '',
        fullName: '',
        id: '',
        username: '',
        password: '',
        role: Role.ADMIN,
      },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(users);
    // const resUsers = await controller.findAll();
    // expect(resUsers).toBe<User[]>(users);
  });

  it('should return one user data', async () => {
    const user = {
      email: '',
      fullName: '',
      id: '',
      username: '',
      password: '',
      role: Role.ADMIN,
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(user);
    const resUsers = await controller.findOne('');
    expect(resUsers).toBe<User>(user);
  });
});
