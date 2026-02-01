import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { UsersService } from '../users/users.service';
import { IRepository } from 'src/interface/repository.interface';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/orders.dto';
import { getMockOrder, mockOrders } from 'src/mocks/mockDatas/orders.stub';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let usersService: UsersService;
  let orderRepo: IRepository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: UsersService, useValue: { isExists: jest.fn() } },
        {
          provide: 'OrderRepository',
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            deleteBy: jest.fn(),
            isExists: jest.fn(),
          },
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    usersService = module.get<UsersService>(UsersService);
    orderRepo = module.get<IRepository<Order>>('OrderRepository');
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(orderRepo).toBeDefined();
  });

  describe('create()', () => {
    it('should create new order with new order', async () => {
      const order = getMockOrder();
      const createOrder: CreateOrderDto = {
        foodItemId: order.foodItemId,
        username: order.username,
        quantity: 3,
      };
      jest.spyOn(usersService, 'isExists').mockResolvedValue(true);
      jest.spyOn(orderRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(orderRepo, 'update');
      const createFn = jest.spyOn(orderRepo, 'create').mockResolvedValue(order);

      const actual = await ordersService.create(createOrder);
      expect(actual).toEqual(order);
      expect(createFn).toHaveBeenCalledWith(createOrder);
    });

    it('should update order with old order', async () => {
      const order = getMockOrder();
      const createOrder: CreateOrderDto = {
        foodItemId: order.foodItemId,
        username: order.username,
        quantity: 3,
      };
      jest.spyOn(usersService, 'isExists').mockResolvedValue(true);
      jest.spyOn(orderRepo, 'findOneBy').mockResolvedValue(order);
      jest.spyOn(orderRepo, 'update').mockResolvedValue(order);
      const createFn = jest.spyOn(orderRepo, 'create');

      const actual = await ordersService.create(createOrder);
      expect(actual).toEqual(order);
      expect(createFn).not.toHaveBeenCalled();
    });

    it('should return null if user dosent exist', async () => {
      const order = getMockOrder();
      const createOrder: CreateOrderDto = {
        foodItemId: order.foodItemId,
        username: order.username,
        quantity: 3,
      };
      jest.spyOn(usersService, 'isExists');
      jest.spyOn(orderRepo, 'findOneBy');
      jest.spyOn(orderRepo, 'update');
      const createFn = jest.spyOn(orderRepo, 'create');

      const actual = await ordersService.create(createOrder);
      expect(actual).toBeNull();
      expect(createFn).not.toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('should return all orders', async () => {
      const findByFn = jest
        .spyOn(orderRepo, 'findBy')
        .mockResolvedValue(mockOrders);
      const actual = await ordersService.findAll();
      expect(actual).toEqual(mockOrders);
      expect(findByFn).toHaveBeenCalled();
    });
  });

  describe('findByUsername()', () => {
    it('should return all orders with username', async () => {
      const username = getMockUser().username;
      const findByFn = jest
        .spyOn(orderRepo, 'findBy')
        .mockResolvedValue(mockOrders);
      const actual = await ordersService.findByUsername(username);
      expect(actual).toEqual(mockOrders);
      expect(findByFn).toHaveBeenCalledWith({ username });
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const order = { ...getMockOrder(), status: OrderStatus.PENDING };
      const updateFn = jest.spyOn(orderRepo, 'update').mockResolvedValue(order);
      jest.spyOn(orderRepo, 'findOneBy').mockResolvedValue(order);

      const actual = await ordersService.updateStatus(
        order.id,
        OrderStatus.COMPLETED,
      );
      expect(actual).toEqual(order);
      expect(updateFn).toHaveBeenCalledWith({
        id: order.id,
        status: OrderStatus.COMPLETED,
      });
    });

    it('should return null if order dosent exist', async () => {
      const order = getMockOrder();
      const updateFn = jest.spyOn(orderRepo, 'update').mockResolvedValue(null);
      jest.spyOn(orderRepo, 'findOneBy').mockResolvedValue(null);

      const actual = await ordersService.updateStatus(order.id, order.status);
      expect(actual).toBeNull();
      expect(updateFn).not.toHaveBeenCalled();
    });

    it('should throw error if trying to revert completed order', async () => {
      const order = { ...getMockOrder(), status: OrderStatus.COMPLETED };
      const updateFn = jest.spyOn(orderRepo, 'update');
      jest.spyOn(orderRepo, 'findOneBy').mockResolvedValue(order);

      await expect(
        ordersService.updateStatus(order.id, OrderStatus.PENDING),
      ).rejects.toThrow(BadRequestException);
      expect(updateFn).not.toHaveBeenCalled();
    });

    it('should throw error if trying to revert cancelled order', async () => {
      const order = { ...getMockOrder(), status: OrderStatus.CANCELLED };
      const updateFn = jest.spyOn(orderRepo, 'update');
      jest.spyOn(orderRepo, 'findOneBy').mockResolvedValue(order);

      await expect(
        ordersService.updateStatus(order.id, OrderStatus.PENDING),
      ).rejects.toThrow(BadRequestException);
      expect(updateFn).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should return true if order deleted', async () => {
      const id = getMockOrder().id;
      jest.spyOn(orderRepo, 'isExists').mockResolvedValue(true);
      const deleteByFn = jest.spyOn(orderRepo, 'deleteBy');
      const actual = await ordersService.remove(id);
      expect(actual).toBe(true);
      expect(deleteByFn).toHaveBeenCalledWith({ id });
    });
    it('should return false if order dosent exist', async () => {
      const id = randomUUID();
      jest.spyOn(orderRepo, 'isExists').mockResolvedValue(false);
      const deleteByFn = jest.spyOn(orderRepo, 'deleteBy');
      const actual = await ordersService.remove(id);
      expect(actual).toBe(false);
      expect(deleteByFn).not.toHaveBeenCalled();
    });
  });
});
