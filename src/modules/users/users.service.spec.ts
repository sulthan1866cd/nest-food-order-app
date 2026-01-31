import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IRepository } from 'src/interface/repository.interface';
import { User } from './entities/user.entity';
import {
  getMockUser,
  getOriginalPassword,
  mockUsers,
} from 'src/mocks/mockDatas/users.stub';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto.';
import { IAuthService } from 'src/interface/authService.interface';
import { Role } from 'src/gurds/role.enum';
import { ConflictException } from '@nestjs/common';
import { HashService } from '../auth/hash.service';

describe('UsersService', () => {
  let userService: UsersService;
  let userRepo: IRepository<User>;
  let authService: IAuthService;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: {
            create: jest.fn(),
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            deleteBy: jest.fn(),
            isExists: jest.fn(),
          },
        },
        { provide: 'AuthService', useValue: { generateToken: jest.fn() } },
        { provide: HashService, useValue: { hash: jest.fn() } },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepo = module.get<IRepository<User>>('UserRepository');
    authService = module.get<IAuthService>('AuthService');
    hashService = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepo).toBeDefined();
    expect(authService).toBeDefined();
    expect(hashService).toBeDefined();
  });

  describe('create()', () => {
    it('should create new user and return new user with authorization', async () => {
      const user = getMockUser();
      const createUser: CreateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: getOriginalPassword(user.username),
        role: user.role,
        username: user.username,
      };
      const authorization = 'auth key';
      jest.spyOn(userService, 'isExists').mockResolvedValue(false);
      const createFn = jest.spyOn(userRepo, 'create').mockResolvedValue(user);
      jest.spyOn(hashService, 'hash').mockResolvedValue(user.password);
      jest.spyOn(authService, 'generateToken').mockReturnValue(authorization);

      const actual = await userService.create(createUser);
      expect(actual).toEqual({ ...user, authorization });
      expect(createFn).toHaveBeenCalledWith({
        ...createUser,
        password: user.password,
      });
    });

    it('should return null if user already exist', async () => {
      const user = getMockUser();
      const createUser: CreateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
        username: user.username,
      };
      jest.spyOn(userService, 'isExists').mockResolvedValue(true);
      const createFn = jest.spyOn(userRepo, 'create').mockResolvedValue(user);

      const actual = await userService.create(createUser);
      expect(actual).toBeNull();
      expect(createFn).not.toHaveBeenCalledWith(createUser);
    });
  });

  describe('createCustomer()', () => {
    it('should create new customer and return new customer with authorization', async () => {
      const user = getMockUser();
      const createUser: CreateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
        username: user.username,
      };
      const createFn = jest
        .spyOn(userService, 'create')
        .mockResolvedValue(user);

      const actual = await userService.createCustomer(createUser);
      expect(actual).toEqual(user);
      expect(createFn).toHaveBeenCalledWith({
        ...createUser,
        role: Role.CUSTOMER,
      });
    });
  });

  describe('findAll()', () => {
    it('should return all users', async () => {
      const findByFn = jest
        .spyOn(userRepo, 'findBy')
        .mockResolvedValue(mockUsers);
      const actual = await userService.findAll();

      expect(actual).toEqual(mockUsers);
      expect(findByFn).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return all users', async () => {
      const user = getMockUser();
      const findOneByFn = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(user);
      const actual = await userService.findOne(user.username);

      expect(actual).toEqual(user);
      expect(findOneByFn).toHaveBeenCalledWith({ username: user.username });
    });
  });

  describe('findOneByEmail()', () => {
    it('should return all users', async () => {
      const user = getMockUser();
      const findOneByFn = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(user);
      const actual = await userService.findOneByEmail(user.email);

      expect(actual).toEqual(user);
      expect(findOneByFn).toHaveBeenCalledWith({ email: user.email });
    });
  });

  describe('findOneByUsernameOrEmail()', () => {
    it('should return user if found by username or email', async () => {
      const user = getMockUser();
      const findOneByFn = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(user);
      const actual = await userService.findOneByUsernameOrEmail(
        user.username,
        user.email,
      );

      expect(actual).toEqual(user);
      expect(findOneByFn).toHaveBeenCalledWith(
        { username: user.username, email: user.email },
        true,
      );
    });
  });

  describe('findOneCustomer()', () => {
    it('should return all users', async () => {
      const user = getMockUser();
      const findOneByFn = jest
        .spyOn(userRepo, 'findOneBy')
        .mockResolvedValue(user);
      const actual = await userService.findOneCustomer(user.username);

      expect(actual).toEqual(user);
      expect(findOneByFn).toHaveBeenCalledWith({
        username: user.username,
        role: Role.CUSTOMER,
      });
    });
  });

  describe('update()', () => {
    it('should update user and return updated user', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = { email: 'email' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);
      const updateFn = jest.spyOn(userRepo, 'update').mockResolvedValue(user);

      const actual = await userService.update(user.username, updateUser);
      expect(actual).toEqual(user);
      expect(updateFn).toHaveBeenCalledWith({
        ...updateUser,
        username: user.username,
        id: user.id,
      });
    });

    it('should return null if user dosnt exist', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = { fullName: 'fullName' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      const updateFn = jest.spyOn(userRepo, 'update');

      const actual = await userService.update(user.username, updateUser);
      expect(actual).toBeNull();
      expect(updateFn).not.toHaveBeenCalled();
    });

    it('should throw exception if email already exists', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = { email: 'email' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue({ ...user, username: 'new user' });
      const updateFn = jest.spyOn(userRepo, 'update');

      await expect(
        userService.update(user.username, updateUser),
      ).rejects.toThrow(ConflictException);
      expect(updateFn).not.toHaveBeenCalled();
    });
  });

  describe('updateCustomer()', () => {
    it('should update customer and return updated customer', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = { email: 'email' };
      jest.spyOn(userService, 'findOneCustomer').mockResolvedValue(user);
      const updateFn = jest
        .spyOn(userService, 'update')
        .mockResolvedValue(user);

      const actual = await userService.updateCustomer(
        user.username,
        updateUser,
      );
      expect(actual).toEqual(user);
      expect(updateFn).toHaveBeenCalledWith(user.username, updateUser);
    });

    it('should return null if user dosnt exist', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = { email: 'email' };
      jest.spyOn(userService, 'findOneCustomer').mockResolvedValue(null);
      const updateFn = jest.spyOn(userService, 'update');

      const actual = await userService.updateCustomer(
        user.username,
        updateUser,
      );
      expect(actual).toBeNull();
      expect(updateFn).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove user and returns true', async () => {
      const username = getMockUser().username;
      jest.spyOn(userService, 'isExists').mockResolvedValue(true);
      const deleteByFn = jest.spyOn(userRepo, 'deleteBy');

      const actual = await userService.remove(username);
      expect(actual).toBe(true);
      expect(deleteByFn).toHaveBeenCalledWith({ username });
    });

    it('should return false if user dosent exist', async () => {
      const username = getMockUser().username;
      jest.spyOn(userService, 'isExists').mockResolvedValue(false);
      const deleteByFn = jest.spyOn(userRepo, 'deleteBy');

      const actual = await userService.remove(username);
      expect(actual).toBe(false);
      expect(deleteByFn).not.toHaveBeenCalled();
    });
  });

  describe('removeCustomer()', () => {
    it('should remove user and returns true', async () => {
      const user = getMockUser();
      jest.spyOn(userService, 'findOneCustomer').mockResolvedValue(user);
      const deleteByFn = jest.spyOn(userRepo, 'deleteBy');

      const actual = await userService.removeCustomer(user.username);
      expect(actual).toBe(true);
      expect(deleteByFn).toHaveBeenCalledWith({
        username: user.username,
        role: Role.CUSTOMER,
      });
    });

    it('should return false if user dosent exist', async () => {
      const username = getMockUser().username;
      jest.spyOn(userService, 'findOneCustomer').mockResolvedValue(null);
      const deleteByFn = jest.spyOn(userRepo, 'deleteBy');

      const actual = await userService.removeCustomer(username);
      expect(actual).toBe(false);
      expect(deleteByFn).not.toHaveBeenCalled();
    });
  });

  describe('isExists()', () => {
    it('should return true if user of username exist', async () => {
      const username = getMockUser().username;
      jest.spyOn(userRepo, 'isExists').mockResolvedValue(true);

      const actual = await userService.isExists(username);
      expect(actual).toBe(true);
    });

    it('should return false if user of username dosent exist', async () => {
      const username = 'random uusenaem';
      jest.spyOn(userRepo, 'isExists').mockResolvedValue(false);

      const actual = await userService.isExists(username);
      expect(actual).toBe(false);
    });

    it('should return true if user of username of user exist', async () => {
      const user = getMockUser();
      jest.spyOn(userRepo, 'isExists').mockResolvedValue(true);

      const actual = await userService.isExists({
        ...user,
        email: '',
        id: '1-1-1-1-1',
      });
      expect(actual).toBe(true);
    });

    it('should return true if user of email of user exist', async () => {
      const user = getMockUser();
      jest.spyOn(userRepo, 'isExists').mockResolvedValue(true);

      const actual = await userService.isExists({
        ...user,
        username: '',
        id: '1-1-1-1-1',
      });
      expect(actual).toBe(true);
    });

    it('should return true if user of id of user exist', async () => {
      const user = getMockUser();
      jest.spyOn(userRepo, 'isExists').mockResolvedValue(true);

      const actual = await userService.isExists({
        ...user,
        email: '',
        username: '',
      });
      expect(actual).toBe(true);
    });

    it('should return false if user dosent exist', async () => {
      const user = getMockUser();
      jest.spyOn(userRepo, 'isExists').mockResolvedValue(false);

      const actual = await userService.isExists({
        ...user,
        email: '',
        id: '1-1-1-1-1',
        username: '',
      });
      expect(actual).toBe(false);
    });
  });
});
