import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { UsersService } from '../users/users.service';
import { IRepository } from 'src/interface/repository.interface';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/orders.dto';
import { getMockOrder, mockOrders } from 'src/mocks/mockDatas/orders.stub';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';
import { randomUUID } from 'crypto';

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
        time: new Date(),
      };
      const isExistsFn = jest
        .spyOn(usersService, 'isExists')
        .mockResolvedValue(true);
      const findOneByFn = jest
        .spyOn(orderRepo, 'findOneBy')
        .mockResolvedValue(null);
      const updateFn = jest.spyOn(orderRepo, 'update');
      const createFn = jest.spyOn(orderRepo, 'create').mockResolvedValue(order);
      const actual = await ordersService.create(createOrder);
      expect(actual).toBe(order);
      expect(isExistsFn).toHaveBeenCalledWith(order.username);
      expect(findOneByFn).toHaveBeenCalledWith({
        username: order.username,
        foodItemId: order.foodItemId,
      });
      expect(updateFn).not.toHaveBeenCalled();
      expect(createFn).toHaveBeenCalledWith(createOrder);
    });

    it('should update order with old order', async () => {
      const order = getMockOrder();
      const createOrder: CreateOrderDto = {
        foodItemId: order.foodItemId,
        username: order.username,
        quantity: 3,
        time: new Date(),
      };
      const isExistsFn = jest
        .spyOn(usersService, 'isExists')
        .mockResolvedValue(true);
      const findOneByFn = jest
        .spyOn(orderRepo, 'findOneBy')
        .mockResolvedValue(order);
      const updateFn = jest.spyOn(orderRepo, 'update').mockResolvedValue(order);
      const createFn = jest.spyOn(orderRepo, 'create');
      const actual = await ordersService.create(createOrder);
      expect(actual).toBe(order);
      expect(isExistsFn).toHaveBeenCalledWith(order.username);
      expect(findOneByFn).toHaveBeenCalledWith({
        username: order.username,
        foodItemId: order.foodItemId,
      });
      expect(updateFn).toHaveBeenCalledWith({
        ...order,
        quantity: order.quantity + createOrder.quantity,
      });
      expect(createFn).not.toHaveBeenCalled();
    });

    it('should return null if user dosent exist', async () => {
      const order = getMockOrder();
      const createOrder: CreateOrderDto = {
        foodItemId: order.foodItemId,
        username: order.username,
        quantity: 3,
        time: new Date(),
      };
      const isExistsFn = jest
        .spyOn(usersService, 'isExists')
        .mockResolvedValue(false);
      const findOneByFn = jest.spyOn(orderRepo, 'findOneBy');
      const updateFn = jest.spyOn(orderRepo, 'update');
      const createFn = jest.spyOn(orderRepo, 'create');
      const actual = await ordersService.create(createOrder);
      expect(actual).toBeNull();
      expect(isExistsFn).toHaveBeenCalledWith(order.username);
      expect(findOneByFn).not.toHaveBeenCalled();
      expect(updateFn).not.toHaveBeenCalled();
      expect(createFn).not.toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('should return all orders', async () => {
      const findByFn = jest
        .spyOn(orderRepo, 'findBy')
        .mockResolvedValue(mockOrders);
      const actual = await ordersService.findAll();
      expect(actual).toBe(mockOrders);
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
      expect(actual).toBe(mockOrders);
      expect(findByFn).toHaveBeenCalledWith({ username });
    });
  });

  describe('remove', () => {
    it('should return true if order deleted', async () => {
      const id = getMockOrder().id;
      jest.spyOn(orderRepo, 'findBy').mockResolvedValue(mockOrders);
      const deleteByFn = jest.spyOn(orderRepo, 'deleteBy');
      const actual = await ordersService.remove(id);
      expect(actual).toBe(true);
      expect(deleteByFn).toHaveBeenCalledWith({ id });
    });
    it('should return false if order dosent exist', async () => {
      const id = randomUUID();
      jest.spyOn(orderRepo, 'findBy').mockResolvedValue(mockOrders);
      const deleteByFn = jest.spyOn(orderRepo, 'deleteBy');
      const actual = await ordersService.remove(id);
      expect(actual).toBe(false);
      expect(deleteByFn).not.toHaveBeenCalled();
    });
  });
});
