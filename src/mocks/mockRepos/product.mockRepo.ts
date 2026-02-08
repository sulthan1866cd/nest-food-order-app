import { Product } from 'src/modules/products/entities/product.entity';
import { BaseMockRepository } from './baseMockRepo';
import { mockProducts } from '../mockDatas/products.stub';
import { Inject } from '@nestjs/common';
import { type IRepository } from 'src/interface/repository.interface';
import { Shop } from 'src/modules/shops/entities/shop.entity';

export class ProductMockRepository extends BaseMockRepository<Product> {
  constructor(
    @Inject('ShopRepository')
    private readonly shopRepository: IRepository<Shop>,
  ) {
    super(Promise.resolve(mockProducts));
  }
  async create(entity: Product): Promise<Product | null> {
    entity.shop = (await this.shopRepository.findOneBy({
      id: entity.shopId,
    })) as Shop;
    return super.create(entity);
  }
}
