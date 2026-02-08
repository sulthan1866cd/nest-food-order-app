import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { getMockOrder, mockOrders } from 'src/mocks/mockDatas/orders.stub';
import { CreateOrderDto } from './dto/orders.dto';
import { NotFoundException } from '@nestjs/common';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';
import { OrderStatus } from './entities/order.entity';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUsername: jest.fn(),
            updateStatus: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: 'AuthService', useValue: {} },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
    expect(ordersService).toBeDefined();
  });

  describe('create()', () => {
    it('should create new order and return created order', async () => {
      const order = getMockOrder();
      const createOrder: CreateOrderDto = {
        productId: order.productId,
        username: order.username,
        quantity: 3,
      };
      const createFn = jest
        .spyOn(ordersService, 'create')
        .mockResolvedValue(order);

      const actual = await ordersController.create(createOrder);
      expect(actual).toEqual(order);
      expect(createFn).toHaveBeenCalledWith(createOrder);
    });

    it('should throw exception if user dosent exist', async () => {
      const order = getMockOrder();
      const createOrder: CreateOrderDto = {
        productId: order.productId,
        username: order.username,
        quantity: 3,
      };
      const createFn = jest
        .spyOn(ordersService, 'create')
        .mockResolvedValue(null);

      await expect(ordersController.create(createOrder)).rejects.toThrow(
        NotFoundException,
      );
      expect(createFn).toHaveBeenCalledWith(createOrder);
    });
  });

  describe('findAll()', () => {
    it('should return all orders', async () => {
      const findAllFn = jest
        .spyOn(ordersService, 'findAll')
        .mockResolvedValue(mockOrders);

      const actual = await ordersController.findAll();
      expect(actual).toEqual(mockOrders);
      expect(findAllFn).toHaveBeenCalled();
    });
  });

  describe('findByUsername()', () => {
    it('should return all orders with given username', async () => {
      const username = getMockUser().username;
      const findByUsernameFn = jest
        .spyOn(ordersService, 'findByUsername')
        .mockResolvedValue(mockOrders);

      const actual = await ordersController.findByUsername(username);
      expect(actual).toEqual(mockOrders);
      expect(findByUsernameFn).toHaveBeenCalledWith(username);
    });
  });

  describe('updateStatus()', () => {
    it('should update order status and return updated order', async () => {
      const order = getMockOrder();
      const updateStatusDto = { status: OrderStatus.COMPLETED };
      const updateStatusFn = jest
        .spyOn(ordersService, 'updateStatus')
        .mockResolvedValue(order);

      const actual = await ordersController.updateStatus(
        order.id,
        updateStatusDto,
      );
      expect(actual).toEqual(order);
      expect(updateStatusFn).toHaveBeenCalledWith(
        order.id,
        updateStatusDto.status,
      );
    });

    it('should throw exception if order dosent exist', async () => {
      const order = getMockOrder();
      const updateStatusDto = { status: OrderStatus.COMPLETED };
      const updateStatusFn = jest
        .spyOn(ordersService, 'updateStatus')
        .mockResolvedValue(null);

      await expect(
        ordersController.updateStatus(order.id, updateStatusDto),
      ).rejects.toThrow(NotFoundException);
      expect(updateStatusFn).toHaveBeenCalledWith(
        order.id,
        updateStatusDto.status,
      );
    });
  });

  describe('remove()', () => {
    it('should delete order of given id', async () => {
      const id = getMockOrder().id;
      const removeFn = jest
        .spyOn(ordersService, 'remove')
        .mockResolvedValue(true);

      await ordersController.remove(id);
      expect(removeFn).toHaveBeenCalledWith(id);
    });

    it('should throw exception if order dosent exist', async () => {
      const id = getMockOrder().id;
      const removeFn = jest
        .spyOn(ordersService, 'remove')
        .mockResolvedValue(false);

      await expect(ordersController.remove(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(removeFn).toHaveBeenCalledWith(id);
    });
  });
});
