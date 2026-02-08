import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Shop } from '../entities/shop.entity';
export class CreateShopDto extends OmitType(Shop, ['id', 'mall']) {}
export class UpdateShopDto extends PartialType(
  OmitType(Shop, ['id', 'mall', 'mallId']),
) {}
