import { UUID } from 'crypto';
import { Mall } from 'src/modules/malls/entities/mall.entity';

export class Shop {
  id: UUID;
  name: string;
  location: string;
  mallId: UUID;
  mall: Mall;
}
