import { Test, TestingModule } from '@nestjs/testing';
import { FoodItemsController } from './food-items.controller';
import { FoodItemsService } from './food-items.service';
import {
  getMockFoodItem,
  getMockImageFile,
  mockFoodItems,
} from 'src/mocks/mockDatas/foodItems.stub';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpdateFoodItemDto } from './dto/food-item.dto';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';

describe('FoodItemsController', () => {
  let foodItemController: FoodItemsController;
  let foodItemService: FoodItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodItemsController],
      providers: [
        {
          provide: FoodItemsService,
          useValue: {
            create: jest.fn(),
            findAllBy: jest.fn(),
            findAllByOrdersUserame: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: 'AuthService', useValue: {} },
      ],
    }).compile();

    foodItemController = module.get<FoodItemsController>(FoodItemsController);
    foodItemService = module.get<FoodItemsService>(FoodItemsService);
  });

  it('should be defined', () => {
    expect(foodItemController).toBeDefined();
    expect(foodItemService).toBeDefined();
  });

  describe('create()', () => {
    it('should return created foodItem', async () => {
      const foodItem = getMockFoodItem();
      const image = getMockImageFile();
      const createFn = jest
        .spyOn(foodItemService, 'create')
        .mockResolvedValue(foodItem);

      const actual = await foodItemController.create(foodItem, image);
      expect(actual).toEqual(foodItem);
      expect(createFn).toHaveBeenCalledWith(foodItem, image);
    });

    it('should throw exception if service returns null', async () => {
      const foodItem = getMockFoodItem();
      const image = getMockImageFile();
      const createFn = jest
        .spyOn(foodItemService, 'create')
        .mockResolvedValue(null);

      await expect(foodItemController.create(foodItem, image)).rejects.toThrow(
        ConflictException,
      );
      expect(createFn).toHaveBeenCalledWith(foodItem, image);
    });
  });

  describe('findAll()', () => {
    it('should return all foodItems', async () => {
      const findAllByFn = jest
        .spyOn(foodItemService, 'findAllBy')
        .mockResolvedValue(mockFoodItems);

      const actual = await foodItemController.findAll();
      expect(actual).toEqual(mockFoodItems);
      expect(findAllByFn).toHaveBeenCalledWith({
        searchQuery: undefined,
        min: undefined,
        max: undefined,
      });
    });

    it('should return all foodItems matching search queries', async () => {
      const searchParams = { searchQuery: 'abc', min: '20', max: '40' };
      const findAllByFn = jest
        .spyOn(foodItemService, 'findAllBy')
        .mockResolvedValue(mockFoodItems);
      const actual = await foodItemController.findAll(
        searchParams.searchQuery,
        searchParams.min,
        searchParams.max,
      );
      expect(actual).toEqual(mockFoodItems);
      expect(findAllByFn).toHaveBeenCalledWith(searchParams);
    });
  });

  describe('findAllByOrdersUsername()', () => {
    it('should return foodItems of user  orders', async () => {
      const username = getMockUser().username;
      const findAllByOrdersUserameFn = jest
        .spyOn(foodItemService, 'findAllByOrdersUserame')
        .mockResolvedValue(mockFoodItems);

      const actual = await foodItemController.findAllByOrdersUsername(username);
      expect(actual).toEqual(mockFoodItems);
      expect(findAllByOrdersUserameFn).toHaveBeenCalledWith(username);
    });
  });

  describe('findOne()', () => {
    it('should return foodItem of given id', async () => {
      const foodItem = getMockFoodItem();
      const findOneFn = jest
        .spyOn(foodItemService, 'findOne')
        .mockResolvedValue(foodItem);

      const actual = await foodItemController.findOne(foodItem.id);
      expect(actual).toEqual(foodItem);
      expect(findOneFn).toHaveBeenCalledWith(foodItem.id);
    });

    it('should throw exception if service returns null', async () => {
      const id = randomUUID();
      const findOneFn = jest
        .spyOn(foodItemService, 'findOne')
        .mockResolvedValue(null);

      await expect(foodItemController.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(findOneFn).toHaveBeenCalledWith(id);
    });
  });

  describe('update()', () => {
    it('should get changes and return updated foodItem', async () => {
      const foodItem = getMockFoodItem();
      const image = getMockImageFile();
      const updateFoodItem: UpdateFoodItemDto = { name: 'new name', price: 33 };
      const updateFn = jest
        .spyOn(foodItemService, 'update')
        .mockResolvedValue(foodItem);

      const actual = await foodItemController.update(
        foodItem.id,
        updateFoodItem,
        image,
      );
      expect(actual).toEqual(foodItem);
      expect(updateFn).toHaveBeenCalledWith(foodItem.id, updateFoodItem, image);
    });

    it('should throw exception if foodItem dosent exist', async () => {
      const id = randomUUID();
      const image = getMockImageFile();
      const updateFoodItem: UpdateFoodItemDto = { name: 'new name', price: 33 };
      const updateFn = jest
        .spyOn(foodItemService, 'update')
        .mockResolvedValue(null);

      await expect(
        foodItemController.update(id, updateFoodItem, image),
      ).rejects.toThrow(NotFoundException);
      expect(updateFn).toHaveBeenCalledWith(id, updateFoodItem, image);
    });
  });

  describe('remove()', () => {
    it('should remove food item of id', async () => {
      const id = randomUUID();
      const deleteFn = jest
        .spyOn(foodItemService, 'remove')
        .mockResolvedValue(true);

      await foodItemController.remove(id);
      expect(deleteFn).toHaveBeenCalledWith(id);
    });

    it('should throw exception if foodItem dosnt exists', async () => {
      const id = randomUUID();
      const deleteFn = jest
        .spyOn(foodItemService, 'remove')
        .mockResolvedValue(false);

      await expect(foodItemController.remove(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(deleteFn).toHaveBeenCalledWith(id);
    });
  });
});
