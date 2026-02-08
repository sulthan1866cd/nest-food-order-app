import { faker } from '@faker-js/faker';
import { randomInt, randomUUID } from 'crypto';
import { Product } from 'src/modules/products/entities/product.entity';
import { getMockShop } from './shops.stub';

export const mockProducts: Product[] = Array.from({ length: 50 }, () => {
  const shop = getMockShop();
  return {
    id: randomUUID(),
    name: faker.commerce.productName(),
    price: +faker.commerce.price(),
    image: faker.image.urlPicsumPhotos(),
    shopId: shop.id,
    shop,
  };
});

export const getMockProduct = (): Product =>
  mockProducts[randomInt(mockProducts.length - 1)];

export const getMockImageFile = (): Express.Multer.File =>
  ({ buffer: Buffer.of(2) }) as Express.Multer.File;
