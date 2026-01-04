import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admins.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto.';
import { getMockUser, mockUsers } from 'src/mocks/mockDatas/users.stub';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AdminsController', () => {
  let adminsController: AdminsController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: 'AuthService', useValue: {} },
      ],
    }).compile();

    adminsController = module.get<AdminsController>(AdminsController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(adminsController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create()', () => {
    it('should create admin return new admin', async () => {
      const user = getMockUser();
      const createUser: CreateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
        username: user.username,
      };
      const createCustomerFn = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(user);

      const actual = await adminsController.create(createUser);
      expect(actual).toEqual(user);
      expect(createCustomerFn).toHaveBeenCalledWith(createUser);
    });

    it('should throw exception if admin already exists', async () => {
      const user = getMockUser();
      const createUser: CreateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
        username: user.username,
      };
      const createCustomerFn = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(null);

      await expect(adminsController.create(createUser)).rejects.toThrow(
        ConflictException,
      );
      expect(createCustomerFn).toHaveBeenCalledWith(createUser);
    });
  });

  describe('findAll()', () => {
    it('should return all users', async () => {
      const findAllFn = jest
        .spyOn(usersService, 'findAll')
        .mockResolvedValue(mockUsers);
      const actual = await adminsController.findAll();
      expect(actual).toEqual(mockUsers);
      expect(findAllFn).toHaveBeenCalled();
    });
  });

  describe('fineOne()', () => {
    it('should create admin return new admin', async () => {
      const user = getMockUser();
      const findOneCustomerFn = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(user);

      const actual = await adminsController.findOne(user.username);
      expect(actual).toEqual(user);
      expect(findOneCustomerFn).toHaveBeenCalledWith(user.username);
    });

    it('should throw exception if admin already exists', async () => {
      const user = getMockUser();
      const findOneCustomerFn = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(null);

      await expect(adminsController.findOne(user.username)).rejects.toThrow(
        NotFoundException,
      );
      expect(findOneCustomerFn).toHaveBeenCalledWith(user.username);
    });
  });

  describe('update()', () => {
    it('should update admin return updated admin', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
      };
      const updateCustomerFn = jest
        .spyOn(usersService, 'update')
        .mockResolvedValue(user);

      const actual = await adminsController.update(user.username, updateUser);
      expect(actual).toEqual(user);
      expect(updateCustomerFn).toHaveBeenCalledWith(user.username, updateUser);
    });

    it('should throw exception if admin dosent exists', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
      };
      const updateCustomerFn = jest
        .spyOn(usersService, 'update')
        .mockResolvedValue(null);

      await expect(
        adminsController.update(user.username, updateUser),
      ).rejects.toThrow(NotFoundException);
      expect(updateCustomerFn).toHaveBeenCalledWith(user.username, updateUser);
    });
  });

  describe('remove()', () => {
    it('should delete user with username', async () => {
      const username = getMockUser().username;
      const removeCustomerFn = jest
        .spyOn(usersService, 'remove')
        .mockResolvedValue(true);

      await adminsController.remove(username);
      expect(removeCustomerFn).toHaveBeenCalledWith(username);
    });

    it('should throw exception if user dosent exists', async () => {
      const username = getMockUser().username;
      const removeCustomerFn = jest
        .spyOn(usersService, 'remove')
        .mockResolvedValue(false);

      await expect(adminsController.remove(username)).rejects.toThrow(
        NotFoundException,
      );
      expect(removeCustomerFn).toHaveBeenCalledWith(username);
    });
  });
});
