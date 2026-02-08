import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/shop.dto';
import { UpdateShopDto } from './dto/shop.dto';
import { type IRepository } from 'src/interface/repository.interface';
import { Shop } from './entities/shop.entity';
import { UUID } from 'crypto';
import { Mall } from '../malls/entities/mall.entity';
import { MallsService } from '../malls/malls.service';

@Injectable()
export class ShopsService {
  constructor(
    @Inject('ShopRepository')
    private readonly shopRepo: IRepository<Shop>,
    private readonly mallService: MallsService,
  ) {}
  async create(createShopDto: CreateShopDto): Promise<Shop | null> {
    if (await this.isExists({ name: createShopDto.name })) return null;
    if (!(await this.mallService.isExists({ id: createShopDto.mallId })))
      throw new NotFoundException(
        `Mall: ${createShopDto.mallId} does not exist`,
      );
    return this.shopRepo.create(createShopDto);
  }

  findAll(): Promise<Shop[]> {
    return this.shopRepo.findBy();
  }

  findAllByMallId(mallId: UUID): Promise<Shop[]> {
    return this.shopRepo.findBy({ mallId });
  }

  findOne(id: UUID): Promise<Shop | null> {
    return this.shopRepo.findOneBy({ id });
  }

  async update(id: UUID, updateShopDto: UpdateShopDto): Promise<Shop | null> {
    if (!(await this.isExists(id))) return null;
    return this.shopRepo.update({ ...updateShopDto, id });
  }

  async remove(id: UUID): Promise<boolean> {
    if (!(await this.isExists(id))) return false;
    await this.shopRepo.deleteBy({ id });
    return true;
  }

  isExists(checkShop: Partial<Shop> | UUID): Promise<boolean> {
    if (typeof checkShop === 'string') {
      return this.shopRepo.isExists({ id: checkShop }, true);
    }
    return this.shopRepo.isExists(
      { id: checkShop.id, name: checkShop.name, mallId: checkShop.mallId },
      true,
    );
  }
}
