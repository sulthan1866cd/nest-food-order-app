import { Shop } from 'src/modules/shops/entities/shop.entity';
import { BaseMockRepository } from './baseMockRepo';
import { mockShops } from '../mockDatas/shops.stub';
import { Mall } from 'src/modules/malls/entities/mall.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

export class ShopMockRepository extends BaseMockRepository<Shop> {
  constructor(
    @Inject('MallRepository')
    private readonly mallRepository: IRepository<Mall>,
  ) {
    super(Promise.resolve(mockShops));
  }
  async create(entity: Shop): Promise<Shop | null> {
    entity.mall = (await this.mallRepository.findOneBy({
      id: entity.mallId,
    })) as Mall;
    return super.create(entity);
  }
}
