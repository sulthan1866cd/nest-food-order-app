import { Inject, Injectable } from '@nestjs/common';
import { CreateMallDto } from './dto/mall.dto';
import { UpdateMallDto } from './dto/mall.dto';
import { type IRepository } from 'src/interface/repository.interface';
import { Mall } from './entities/mall.entity';
import { UUID } from 'crypto';

@Injectable()
export class MallsService {
  constructor(
    @Inject('MallRepository')
    private readonly mallRepo: IRepository<Mall>,
  ) {}
  async create(createMallDto: CreateMallDto): Promise<Mall | null> {
    if (await this.isExists(createMallDto)) return null;
    return this.mallRepo.create(createMallDto);
  }

  findAll(): Promise<Mall[]> {
    return this.mallRepo.findBy();
  }

  findOne(id: UUID): Promise<Mall | null> {
    return this.mallRepo.findOneBy({ id });
  }

  async update(id: UUID, updateMallDto: UpdateMallDto): Promise<Mall | null> {
    if (!(await this.isExists(updateMallDto))) return null;
    return this.mallRepo.update({ id, ...updateMallDto });
  }

  async remove(id: UUID): Promise<boolean> {
    if (!(await this.isExists({ id }))) return false;
    await this.mallRepo.deleteBy({ id });
    return true;
  }

  isExists(checkMall: Partial<Mall>): Promise<boolean> {
    return this.mallRepo.isExists(
      { id: checkMall.id, name: checkMall.name },
      true,
    );
  }
}
