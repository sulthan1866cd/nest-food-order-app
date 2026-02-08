import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  getMockProduct,
  getMockImageFile,
  mockProducts,
} from 'src/mocks/mockDatas/products.stub';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpdateProductDto } from './dto/product.dto';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';

describe('ProductsController', () => {
  let productController: ProductsController;
  let productService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
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

    productController = module.get<ProductsController>(ProductsController);
    productService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('create()', () => {
    it('should return created product', async () => {
      const product = getMockProduct();
      const image = getMockImageFile();
      const createFn = jest
        .spyOn(productService, 'create')
        .mockResolvedValue(product);

      const actual = await productController.create(product, image);
      expect(actual).toEqual(product);
      expect(createFn).toHaveBeenCalledWith(product, image);
    });

    it('should throw exception if service returns null', async () => {
      const product = getMockProduct();
      const image = getMockImageFile();
      const createFn = jest
        .spyOn(productService, 'create')
        .mockResolvedValue(null);

      await expect(productController.create(product, image)).rejects.toThrow(
        ConflictException,
      );
      expect(createFn).toHaveBeenCalledWith(product, image);
    });
  });

  describe('findAll()', () => {
    it('should return all products', async () => {
      const findAllByFn = jest
        .spyOn(productService, 'findAllBy')
        .mockResolvedValue(mockProducts);

      const actual = await productController.findAll();
      expect(actual).toEqual(mockProducts);
      expect(findAllByFn).toHaveBeenCalledWith({
        searchQuery: undefined,
        min: undefined,
        max: undefined,
      });
    });

    it('should return all products matching search queries', async () => {
      const searchParams = { searchQuery: 'abc', min: '20', max: '40' };
      const findAllByFn = jest
        .spyOn(productService, 'findAllBy')
        .mockResolvedValue(mockProducts);
      const actual = await productController.findAll(
        searchParams.searchQuery,
        searchParams.min,
        searchParams.max,
      );
      expect(actual).toEqual(mockProducts);
      expect(findAllByFn).toHaveBeenCalledWith(searchParams);
    });
  });

  describe('findAllByOrdersUsername()', () => {
    it('should return products of user  orders', async () => {
      const username = getMockUser().username;
      const findAllByOrdersUserameFn = jest
        .spyOn(productService, 'findAllByOrdersUserame')
        .mockResolvedValue(mockProducts);

      const actual = await productController.findAllByOrdersUsername(username);
      expect(actual).toEqual(mockProducts);
      expect(findAllByOrdersUserameFn).toHaveBeenCalledWith(username);
    });
  });

  describe('findOne()', () => {
    it('should return product of given id', async () => {
      const product = getMockProduct();
      const findOneFn = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(product);

      const actual = await productController.findOne(product.id);
      expect(actual).toEqual(product);
      expect(findOneFn).toHaveBeenCalledWith(product.id);
    });

    it('should throw exception if service returns null', async () => {
      const id = randomUUID();
      const findOneFn = jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(null);

      await expect(productController.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(findOneFn).toHaveBeenCalledWith(id);
    });
  });

  describe('update()', () => {
    it('should get changes and return updated product', async () => {
      const product = getMockProduct();
      const image = getMockImageFile();
      const updateProduct: UpdateProductDto = { name: 'new name', price: 33 };
      const updateFn = jest
        .spyOn(productService, 'update')
        .mockResolvedValue(product);

      const actual = await productController.update(
        product.id,
        updateProduct,
        image,
      );
      expect(actual).toEqual(product);
      expect(updateFn).toHaveBeenCalledWith(product.id, updateProduct, image);
    });

    it('should throw exception if product dosent exist', async () => {
      const id = randomUUID();
      const image = getMockImageFile();
      const updateProduct: UpdateProductDto = { name: 'new name', price: 33 };
      const updateFn = jest
        .spyOn(productService, 'update')
        .mockResolvedValue(null);

      await expect(
        productController.update(id, updateProduct, image),
      ).rejects.toThrow(NotFoundException);
      expect(updateFn).toHaveBeenCalledWith(id, updateProduct, image);
    });
  });

  describe('remove()', () => {
    it('should remove food item of id', async () => {
      const id = randomUUID();
      const deleteFn = jest
        .spyOn(productService, 'remove')
        .mockResolvedValue(true);

      await productController.remove(id);
      expect(deleteFn).toHaveBeenCalledWith(id);
    });

    it('should throw exception if product dosnt exists', async () => {
      const id = randomUUID();
      const deleteFn = jest
        .spyOn(productService, 'remove')
        .mockResolvedValue(false);

      await expect(productController.remove(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(deleteFn).toHaveBeenCalledWith(id);
    });
  });
});
