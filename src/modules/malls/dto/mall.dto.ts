import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { Mall } from '../entities/mall.entity';

export class CreateMallDto extends OmitType(Mall, ['id']) {}
export class UpdateMallDto extends PartialType(CreateMallDto) {}
