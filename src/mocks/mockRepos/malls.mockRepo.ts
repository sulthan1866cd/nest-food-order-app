import { Mall } from 'src/modules/malls/entities/mall.entity';
import { BaseMockRepository } from './baseMockRepo';
import { mockMalls } from '../mockDatas/malls.stub';

export class MallMockRepository extends BaseMockRepository<Mall> {
  constructor() {
    super(Promise.resolve(mockMalls));
  }
}
