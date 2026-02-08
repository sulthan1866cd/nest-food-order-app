import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Put,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/shop.dto';
import { UpdateShopDto } from './dto/shop.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { type UUID } from 'crypto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/guards/role.enum';
import { Roles } from 'src/guards/roles.decorator';
import { Shop } from './entities/shop.entity';
import { MallIdIntegrityGuard } from 'src/guards/mallIdIntegrity.guard';

@Controller('shops')
@UseGuards(AuthGuard, RolesGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(MallIdIntegrityGuard)
  async create(@Body() createShopDto: CreateShopDto): Promise<Shop> {
    const createdShop = await this.shopsService.create(createShopDto);
    if (!createdShop)
      throw new ConflictException(`shop: ${createShopDto.name} already exists`);
    return createdShop;
  }

  @Get()
  findAll(): Promise<Shop[]> {
    return this.shopsService.findAll();
  }

  @Get('malls/:mallId')
  findAllByMallId(
    @Param('mallId', ParseUUIDPipe) mallId: UUID,
  ): Promise<Shop[]> {
    return this.shopsService.findAllByMallId(mallId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<Shop> {
    const shop = await this.shopsService.findOne(id);
    if (!shop) throw new NotFoundException(`shop: ${id} does not exists`);
    return shop;
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(MallIdIntegrityGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateShopDto: UpdateShopDto,
  ): Promise<Shop> {
    const updatedShop = await this.shopsService.update(id, updateShopDto);
    if (!updatedShop)
      throw new NotFoundException(`shop: ${id} does not exists`);
    return updatedShop;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    const isDeleted = await this.shopsService.remove(id);
    if (!isDeleted) throw new NotFoundException(`shop: ${id} does not exists`);
  }
}
