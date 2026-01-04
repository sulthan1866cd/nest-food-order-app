import { Test, TestingModule } from '@nestjs/testing';
import { FoodItemsService } from './food-items.service';
import { IRepository } from 'src/interface/repository.interface';
import { FoodItem } from './entities/food-item.entity';
import { OrdersService } from '../orders/orders.service';
import { CreateFoodItemDto, UpdateFoodItemDto } from './dto/food-item.dto';
import { IS3ClientService } from 'src/interface/s3ClientService.interface';
import { randomUUID } from 'crypto';
import { Order } from '../orders/entities/order.entity';
import {
  mockFoodItems,
  getMockFoodItem,
  getMockImageFile,
} from 'src/mocks/mockDatas/foodItems.stub';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';

describe('FoodItemsService', () => {
  let foodItemsService: FoodItemsService;
  let ordersService: OrdersService;
  let foodItemRepo: IRepository<FoodItem>;
  let s3ClientService: IS3ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodItemsService,
        {
          provide: OrdersService,
          useValue: { findByUsername: jest.fn() },
        },
        {
          provide: 'FoodItemRepository',
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            deleteBy: jest.fn(),
          },
        },
        {
          provide: 'S3ClientService',
          useValue: { upload: jest.fn(), delete: jest.fn() },
        },
      ],
    }).compile();

    foodItemsService = module.get<FoodItemsService>(FoodItemsService);
    ordersService = module.get<OrdersService>(OrdersService);
    foodItemRepo = module.get<IRepository<FoodItem>>('FoodItemRepository');
    s3ClientService = module.get<IS3ClientService>('S3ClientService');
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(foodItemsService).toBeDefined();
    expect(ordersService).toBeDefined();
    expect(foodItemRepo).toBeDefined();
    expect(s3ClientService).toBeDefined();
  });

  describe('create()', () => {
    beforeEach(() => {
      jest.spyOn(foodItemRepo, 'findBy').mockResolvedValue(mockFoodItems);
    });

    it('gets foodItem dto to create and return saved foodItem', async () => {
      const imageLink = getMockFoodItem().image;
      const createFoodItem: CreateFoodItemDto = {
        name: 'new food',
        price: 99,
      };
      const image = getMockImageFile();
      const expecedFoodItem: FoodItem = {
        id: randomUUID(),
        image: imageLink,
        name: createFoodItem.name,
        price: createFoodItem.price,
      };
      const createFn = jest
        .spyOn(foodItemRepo, 'create')
        .mockResolvedValue(expecedFoodItem);
      jest.spyOn(s3ClientService, 'upload').mockResolvedValue(imageLink);
      jest.spyOn(foodItemRepo, 'update').mockResolvedValue(expecedFoodItem);

      const actual = await foodItemsService.create(createFoodItem, image);
      expect(actual).toEqual(expecedFoodItem);
      expect(createFn).toHaveBeenCalledWith(createFoodItem);
    });

    it('retuns null if foodItem already exists', async () => {
      const createFoodItem: CreateFoodItemDto = {
        name: 'new food',
        price: 99,
      };
      const image = getMockImageFile();
      jest.spyOn(foodItemRepo, 'findBy').mockResolvedValue([
        {
          ...createFoodItem,
          id: randomUUID(),
          image: getMockFoodItem().image,
        },
      ]);
      const createFn = jest.spyOn(foodItemRepo, 'create');

      const actual = await foodItemsService.create(createFoodItem, image);
      expect(actual).toBeNull();
      expect(createFn).not.toHaveBeenCalled();
    });
  });

  describe('findAllBy()', () => {
    it('should get All Food Items if no query passed', async () => {
      const findByFn = jest
        .spyOn(foodItemRepo, 'findBy')
        .mockResolvedValue(mockFoodItems);

      const actual = await foodItemsService.findAllBy({});
      expect(actual).toEqual(mockFoodItems);
      expect(findByFn).toHaveBeenCalled();
    });

    it('should filter according to query', async () => {
      const searchQuery = 'i';
      const min = '20';
      const max = '50';
      const findByFn = jest
        .spyOn(foodItemRepo, 'findBy')
        .mockResolvedValue(mockFoodItems);
      const expectedFoodItems: Omit<FoodItem, 'id'>[] = [
        {
          image:
            'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/04/idli-recipe.jpg',
          name: 'Idli',
          price: 20,
        },
        {
          image:
            'https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2013/11/poori-picture_thumb3.jpg?ssl=1',
          name: 'Poori',
          price: 50,
        },
      ];

      const actual: FoodItem[] = await foodItemsService.findAllBy({
        searchQuery,
        max,
        min,
      });
      expect(actual).toMatchObject(expectedFoodItems);
      expect(findByFn).toHaveBeenCalled();
    });
  });

  describe('findAllByOrdersUserame()', () => {
    it('should return all fooditems of orders of user', async () => {
      const username = getMockUser().username;
      const orders: Order[] = [
        {
          id: randomUUID(),
          quantity: 2,
          time: new Date(),
          username,
          foodItemId: mockFoodItems[0].id,
          foodItem: mockFoodItems[0],
        },
        {
          id: randomUUID(),
          quantity: 2,
          time: new Date(),
          username,
          foodItemId: mockFoodItems[1].id,
          foodItem: mockFoodItems[1],
        },
      ];
      const findByUsernameFn = jest
        .spyOn(ordersService, 'findByUsername')
        .mockResolvedValue(orders);
      const actual = await foodItemsService.findAllByOrdersUserame(username);
      expect(actual).toEqual(mockFoodItems.slice(0, 2));
      expect(findByUsernameFn).toHaveBeenCalledWith(username);
    });
  });

  describe('findOne()', () => {
    it('should return fooditem of id', async () => {
      const foodItem = getMockFoodItem();
      const findOneByFn = jest
        .spyOn(foodItemRepo, 'findOneBy')
        .mockResolvedValue(foodItem);

      const actual = await foodItemsService.findOne(foodItem.id);
      expect(actual).toEqual(foodItem);
      expect(findOneByFn).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should call upload,update with provided data', async () => {
      const foodItem = getMockFoodItem();
      const newImageLink = 'new image link';
      const updateFoodItem: UpdateFoodItemDto = {
        name: 'new food',
        price: 98,
      };
      const image = getMockImageFile();
      const expected: FoodItem = {
        id: foodItem.id,
        image: foodItem.image,
        name: updateFoodItem.name ?? '',
        price: updateFoodItem.price ?? 0,
      };
      jest.spyOn(foodItemRepo, 'findBy').mockResolvedValue(mockFoodItems);
      const uploadFn = jest
        .spyOn(s3ClientService, 'upload')
        .mockResolvedValue(newImageLink);
      const updateFn = jest
        .spyOn(foodItemRepo, 'update')
        .mockResolvedValue(expected);

      const actual = await foodItemsService.update(
        foodItem.id,
        updateFoodItem,
        image,
      );
      expect(actual).toEqual(expected);
      expect(uploadFn).toHaveBeenCalledWith(foodItem.id, image.buffer);
      expect(updateFn).toHaveBeenCalledWith({
        ...updateFoodItem,
        id: foodItem.id,
        image: newImageLink,
      });
    });

    it('should not update image if imageFile is not provided', async () => {
      const foodItem = getMockFoodItem();
      const updateFoodItem: UpdateFoodItemDto = {
        name: 'new food',
        price: 98,
      };
      const expected: FoodItem = {
        id: foodItem.id,
        image: foodItem.image,
        name: updateFoodItem.name ?? '',
        price: updateFoodItem.price ?? 0,
      };
      jest.spyOn(foodItemRepo, 'findBy').mockResolvedValue(mockFoodItems);
      const uploadFn = jest.spyOn(s3ClientService, 'upload');
      const updateFn = jest
        .spyOn(foodItemRepo, 'update')
        .mockResolvedValue(expected);

      const actual = await foodItemsService.update(foodItem.id, updateFoodItem);
      expect(actual).toEqual(expected);
      expect(uploadFn).not.toHaveBeenCalled();
      expect(updateFn).toHaveBeenCalledWith({
        ...updateFoodItem,
        id: foodItem.id,
      });
    });

    it('should return null if foodItem didnt exist', async () => {
      const id = randomUUID();
      const updateFoodItem: UpdateFoodItemDto = {
        name: 'new food',
        price: 98,
      };
      const image = getMockImageFile();
      jest.spyOn(foodItemRepo, 'findBy').mockResolvedValue(mockFoodItems);
      const uploadFn = jest.spyOn(s3ClientService, 'upload');
      const updateFn = jest.spyOn(foodItemRepo, 'update');

      const actual = await foodItemsService.update(id, updateFoodItem, image);
      expect(actual).toBeNull();
      expect(uploadFn).not.toHaveBeenCalled();
      expect(updateFn).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      jest.spyOn(foodItemRepo, 'findBy').mockResolvedValue(mockFoodItems);
    });
    it('should delete image and record of foodItem and return true', async () => {
      const id = getMockFoodItem().id;
      const deleteByFn = jest.spyOn(foodItemRepo, 'deleteBy');
      const deleteFn = jest.spyOn(s3ClientService, 'delete');

      const actual = await foodItemsService.remove(id);
      expect(deleteByFn).toHaveBeenCalledWith({ id });
      expect(deleteFn).toHaveBeenCalledWith(id);
      expect(actual).toBe(true);
    });

    it('should return false if foodItem dosent exists', async () => {
      const id = randomUUID();
      const deleteByFn = jest.spyOn(foodItemRepo, 'deleteBy');
      const deleteFn = jest.spyOn(s3ClientService, 'delete');

      const actual = await foodItemsService.remove(id);
      expect(deleteByFn).not.toHaveBeenCalled();
      expect(deleteFn).not.toHaveBeenCalled();
      expect(actual).toBe(false);
    });
  });
});
