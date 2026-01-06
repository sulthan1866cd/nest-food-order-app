import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  UseGuards,
  ConflictException,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGaurd } from '../../gurds/auth.guard';
import { Roles } from 'src/gurds/roles.decorator';
import { Role } from 'src/gurds/role.enum';
import { RolesGuard } from 'src/gurds/roles.guard';
import { UserValidator } from './pipe/userValidator.pipe';
import { ClientUserDto, CreateUserDto, UpdateUserDto } from './dto/users.dto.';
import { UserInterceptor } from './interceptor/users.interceptor';

@Controller('admin/users')
@UseGuards(AuthGaurd, RolesGuard)
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(UserValidator)
  @UseInterceptors(UserInterceptor)
  async create(@Body() user: CreateUserDto): Promise<ClientUserDto> {
    const addedUser = await this.usersService.create(user);
    if (!addedUser)
      throw new ConflictException(`user: ${user.username} already exists`);

    return addedUser;
  }

  @Get()
  findAll(): Promise<ClientUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':username')
  @Roles(Role.CHEF)
  @UseInterceptors(UserInterceptor)
  async findOne(@Param('username') username: string): Promise<ClientUserDto> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new NotFoundException(`user: ${username} does not exist`);

    return user;
  }

  @Put(':username')
  @Roles(Role.CHEF)
  // @UsePipes(UserValidator)
  @UseInterceptors(UserInterceptor)
  async update(
    @Param('username') username: string,
    @Body() user: UpdateUserDto,
  ): Promise<ClientUserDto> {
    const updatedUser = await this.usersService.update(username, user);
    if (!updatedUser)
      throw new NotFoundException(`user: ${username} does not exist`);

    return updatedUser;
  }

  @Delete(':username')
  @Roles(Role.ADMIN)
  async remove(@Param('username') username: string): Promise<void> {
    const isDeleted = await this.usersService.remove(username);
    if (!isDeleted)
      throw new NotFoundException(`user: ${username} does not exist`);
  }
}
