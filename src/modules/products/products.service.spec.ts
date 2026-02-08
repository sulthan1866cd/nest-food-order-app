import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { IRepository } from 'src/interface/repository.interface';
import { Product } from './entities/product.entity';
import { OrdersService } from '../orders/orders.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { IS3ClientService } from 'src/modules/aws/interfaces/s3ClientService.interface';
import { randomUUID } from 'crypto';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import {
  mockProducts,
  getMockProduct,
  getMockImageFile,
} from 'src/mocks/mockDatas/products.stub';
import { getMockUser } from 'src/mocks/mockDatas/users.stub';
import { ConflictException } from '@nestjs/common';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let ordersService: OrdersService;
  let productRepo: IRepository<Product>;
  let s3ClientService: IS3ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: OrdersService,
          useValue: { findByUsername: jest.fn() },
        },
        {
          provide: 'ProductRepository',
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            deleteBy: jest.fn(),
            isExists: jest.fn(),
          },
        },
        {
          provide: 'S3ClientService',
          useValue: { upload: jest.fn(), delete: jest.fn() },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    ordersService = module.get<OrdersService>(OrdersService);
    productRepo = module.get<IRepository<Product>>('ProductRepository');
    s3ClientService = module.get<IS3ClientService>('S3ClientService');
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(ordersService).toBeDefined();
    expect(productRepo).toBeDefined();
    expect(s3ClientService).toBeDefined();
  });

  describe('create()', () => {
    it('gets product dto to create and return saved product', async () => {
      const imageLink = getMockProduct().image;
      const createProduct: CreateProductDto = {
        name: 'new food',
        price: 99,
      };
      const image = getMockImageFile();
      const expecedProduct: Product = {
        id: randomUUID(),
        image: imageLink,
        name: createProduct.name,
        price: createProduct.price,
      };
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(false);
      const createFn = jest
        .spyOn(productRepo, 'create')
        .mockResolvedValue(expecedProduct);
      jest.spyOn(s3ClientService, 'upload').mockResolvedValue(imageLink);
      jest.spyOn(productRepo, 'update').mockResolvedValue(expecedProduct);

      const actual = await productsService.create(createProduct, image);
      expect(actual).toEqual(expecedProduct);
      expect(createFn).toHaveBeenCalledWith(createProduct);
    });

    it('retuns null if product already exists', async () => {
      const createProduct: CreateProductDto = {
        name: 'new food',
        price: 99,
      };
      const image = getMockImageFile();
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(true);
      const createFn = jest.spyOn(productRepo, 'create');

      const actual = await productsService.create(createProduct, image);
      expect(actual).toBeNull();
      expect(createFn).not.toHaveBeenCalled();
    });
  });

  describe('findAllBy()', () => {
    it('should get All Food Items if no query passed', async () => {
      const findByFn = jest
        .spyOn(productRepo, 'findBy')
        .mockResolvedValue(mockProducts);

      const actual = await productsService.findAllBy({});
      expect(actual).toEqual(mockProducts);
      expect(findByFn).toHaveBeenCalled();
    });

    it('should filter according to query', async () => {
      const searchQuery = 'i';
      const min = '20';
      const max = '50';
      const findByFn = jest
        .spyOn(productRepo, 'findBy')
        .mockResolvedValue(mockProducts);
      const expectedProducts: Omit<Product, 'id'>[] = [
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

      const actual: Product[] = await productsService.findAllBy({
        searchQuery,
        max,
        min,
      });
      expect(actual).toMatchObject(expectedProducts);
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
          productId: mockProducts[0].id,
          product: mockProducts[0],
          status: OrderStatus.PENDING,
        },
        {
          id: randomUUID(),
          quantity: 2,
          time: new Date(),
          username,
          productId: mockProducts[1].id,
          product: mockProducts[1],
          status: OrderStatus.COMPLETED,
        },
      ];
      const findByUsernameFn = jest
        .spyOn(ordersService, 'findByUsername')
        .mockResolvedValue(orders);
      const actual = await productsService.findAllByOrdersUserame(username);
      expect(actual).toEqual(mockProducts.slice(0, 2));
      expect(findByUsernameFn).toHaveBeenCalledWith(username);
    });
  });

  describe('findOne()', () => {
    it('should return fooditem of id', async () => {
      const product = getMockProduct();
      const findOneByFn = jest
        .spyOn(productRepo, 'findOneBy')
        .mockResolvedValue(product);

      const actual = await productsService.findOne(product.id);
      expect(actual).toEqual(product);
      expect(findOneByFn).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should call upload,update with provided data', async () => {
      const product = getMockProduct();
      const newImageLink = 'new image link';
      const updateProduct: UpdateProductDto = {
        name: 'new food',
        price: 98,
      };
      const image = getMockImageFile();
      const expected: Product = {
        id: product.id,
        image: product.image,
        name: updateProduct.name ?? '',
        price: updateProduct.price ?? 0,
      };
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(true);
      jest.spyOn(productRepo, 'findOneBy').mockResolvedValue(null);
      const uploadFn = jest
        .spyOn(s3ClientService, 'upload')
        .mockResolvedValue(newImageLink);
      const updateFn = jest
        .spyOn(productRepo, 'update')
        .mockResolvedValue(expected);

      const actual = await productsService.update(
        product.id,
        updateProduct,
        image,
      );
      expect(actual).toEqual(expected);
      expect(uploadFn).toHaveBeenCalledWith(product.id, image.buffer);
      expect(updateFn).toHaveBeenCalledWith({
        ...updateProduct,
        id: product.id,
        image: newImageLink,
      });
    });

    it('should not update image if imageFile is not provided', async () => {
      const product = getMockProduct();
      const updateProduct: UpdateProductDto = {
        name: 'new food',
        price: 98,
      };
      const expected: Product = {
        id: product.id,
        image: product.image,
        name: updateProduct.name ?? '',
        price: updateProduct.price ?? 0,
      };
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(true);
      jest.spyOn(productRepo, 'findOneBy').mockResolvedValue(null);
      const uploadFn = jest.spyOn(s3ClientService, 'upload');
      const updateFn = jest
        .spyOn(productRepo, 'update')
        .mockResolvedValue(expected);

      const actual = await productsService.update(product.id, updateProduct);
      expect(actual).toEqual(expected);
      expect(uploadFn).not.toHaveBeenCalled();
      expect(updateFn).toHaveBeenCalledWith({
        ...updateProduct,
        id: product.id,
      });
    });

    it('should return null if product didnt exist', async () => {
      const id = randomUUID();
      const updateProduct: UpdateProductDto = {
        name: 'new food',
        price: 98,
      };
      const image = getMockImageFile();
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(false);
      const uploadFn = jest.spyOn(s3ClientService, 'upload');
      const updateFn = jest.spyOn(productRepo, 'update');

      const actual = await productsService.update(id, updateProduct, image);
      expect(actual).toBeNull();
      expect(uploadFn).not.toHaveBeenCalled();
      expect(updateFn).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if name already exists for another food item', async () => {
      const product = getMockProduct();
      const anotherProduct = { ...getMockProduct(), id: randomUUID() };
      const updateProduct: UpdateProductDto = {
        name: anotherProduct.name,
        price: 98,
      };
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(true);
      jest
        .spyOn(productRepo, 'findOneBy')
        .mockResolvedValueOnce(anotherProduct);
      const uploadFn = jest.spyOn(s3ClientService, 'upload');
      const updateFn = jest.spyOn(productRepo, 'update');

      await expect(
        productsService.update(product.id, updateProduct),
      ).rejects.toThrow(ConflictException);
      expect(uploadFn).not.toHaveBeenCalled();
      expect(updateFn).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should delete image and record of product and return true', async () => {
      const id = getMockProduct().id;
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(true);
      const deleteByFn = jest.spyOn(productRepo, 'deleteBy');
      const deleteFn = jest.spyOn(s3ClientService, 'delete');

      const actual = await productsService.remove(id);
      expect(deleteByFn).toHaveBeenCalledWith({ id });
      expect(deleteFn).toHaveBeenCalledWith(id);
      expect(actual).toBe(true);
    });

    it('should return false if product dosent exists', async () => {
      const id = randomUUID();
      jest.spyOn(productRepo, 'isExists').mockResolvedValue(false);
      const deleteByFn = jest.spyOn(productRepo, 'deleteBy');
      const deleteFn = jest.spyOn(s3ClientService, 'delete');

      const actual = await productsService.remove(id);
      expect(deleteByFn).not.toHaveBeenCalled();
      expect(deleteFn).not.toHaveBeenCalled();
      expect(actual).toBe(false);
    });
  });
});
