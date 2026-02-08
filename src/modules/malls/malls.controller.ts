import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  ConflictException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { MallsService } from './malls.service';
import { CreateMallDto, UpdateMallDto } from './dto/mall.dto';
import { type UUID } from 'crypto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/role.enum';
import { Mall } from './entities/mall.entity';

@Controller('malls')
@UseGuards(AuthGuard, RolesGuard)
export class MallsController {
  constructor(private readonly mallsService: MallsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  async create(@Body() createMallDto: CreateMallDto): Promise<Mall> {
    const createdMall = await this.mallsService.create(createMallDto);
    if (!createdMall)
      throw new ConflictException(`Mall: ${createMallDto.name} already exists`);

    return createdMall;
  }

  @Get()
  findAll(): Promise<Mall[]> {
    return this.mallsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<Mall> {
    const mall = await this.mallsService.findOne(id);
    if (!mall) throw new NotFoundException(`mall: ${id} does not exists`);
    return mall;
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateMallDto: UpdateMallDto,
  ): Promise<Mall> {
    const updatedMall = await this.mallsService.update(id, updateMallDto);
    if (!updatedMall)
      throw new NotFoundException(
        `Mall: ${updateMallDto.name} does not exists`,
      );
    return updatedMall;
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    const isDeleted = await this.mallsService.remove(id);
    if (!isDeleted) throw new NotFoundException(`mall: ${id} does not exists`);
  }
}
