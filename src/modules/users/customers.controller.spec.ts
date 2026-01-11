import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto.';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CustomersController', () => {
  let customersController: CustomersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createCustomer: jest.fn(),
            findOneCustomer: jest.fn(),
            updateCustomer: jest.fn(),
            removeCustomer: jest.fn(),
          },
        },
        { provide: 'AuthService', useValue: {} },
      ],
    }).compile();

    customersController = module.get<CustomersController>(CustomersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(customersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create()', () => {
    it('should create customer return new customer', async () => {
      const user = getMockUser();
      const createUser: CreateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
        username: user.username,
      };
      const createCustomerFn = jest
        .spyOn(usersService, 'createCustomer')
        .mockResolvedValue(user);

      const actual = await customersController.create(createUser);
      expect(actual).toEqual(user);
      expect(createCustomerFn).toHaveBeenCalledWith(createUser);
    });

    it('should throw exception if customer already exists', async () => {
      const user = getMockUser();
      const createUser: CreateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
        username: user.username,
      };
      const createCustomerFn = jest
        .spyOn(usersService, 'createCustomer')
        .mockResolvedValue(null);

      await expect(customersController.create(createUser)).rejects.toThrow(
        ConflictException,
      );
      expect(createCustomerFn).toHaveBeenCalledWith(createUser);
    });
  });

  describe('fineOne()', () => {
    it('should create customer return new customer', async () => {
      const user = getMockUser();
      const findOneCustomerFn = jest
        .spyOn(usersService, 'findOneCustomer')
        .mockResolvedValue(user);

      const actual = await customersController.findOne(user.username);
      expect(actual).toEqual(user);
      expect(findOneCustomerFn).toHaveBeenCalledWith(user.username);
    });

    it('should throw exception if customer already exists', async () => {
      const user = getMockUser();
      const findOneCustomerFn = jest
        .spyOn(usersService, 'findOneCustomer')
        .mockResolvedValue(null);

      await expect(customersController.findOne(user.username)).rejects.toThrow(
        NotFoundException,
      );
      expect(findOneCustomerFn).toHaveBeenCalledWith(user.username);
    });
  });

  describe('update()', () => {
    it('should update customer return updated customer', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
      };
      const updateCustomerFn = jest
        .spyOn(usersService, 'updateCustomer')
        .mockResolvedValue(user);

      const actual = await customersController.update(
        user.username,
        updateUser,
      );
      expect(actual).toEqual(user);
      expect(updateCustomerFn).toHaveBeenCalledWith(user.username, updateUser);
    });

    it('should throw exception if customer dosent exists', async () => {
      const user = getMockUser();
      const updateUser: UpdateUserDto = {
        email: user.email,
        fullName: user.fullName,
        password: user.password,
        role: user.role,
      };
      const updateCustomerFn = jest
        .spyOn(usersService, 'updateCustomer')
        .mockResolvedValue(null);

      await expect(
        customersController.update(user.username, updateUser),
      ).rejects.toThrow(NotFoundException);
      expect(updateCustomerFn).toHaveBeenCalledWith(user.username, updateUser);
    });
  });

  describe('remove()', () => {
    it('should remove customer', async () => {
      const user = getMockUser();
      const removeCustomerFn = jest
        .spyOn(usersService, 'removeCustomer')
        .mockResolvedValue(true);

      await customersController.remove(user.username);
      expect(removeCustomerFn).toHaveBeenCalledWith(user.username);
    });

    it('should throw exception if customer dosent exists', async () => {
      const user = getMockUser();
      const removeCustomerFn = jest
        .spyOn(usersService, 'removeCustomer')
        .mockResolvedValue(false);

      await expect(customersController.remove(user.username)).rejects.toThrow(
        NotFoundException,
      );
      expect(removeCustomerFn).toHaveBeenCalledWith(user.username);
    });
  });
});
