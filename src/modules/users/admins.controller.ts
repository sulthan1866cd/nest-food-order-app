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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGaurd } from '../../gurds/auth.guard';
import { Roles } from 'src/gurds/roles.decorator';
import { Role } from 'src/gurds/role.enum';
import { RolesGuard } from 'src/gurds/roles.guard';
import { UserValidator } from './pipe/userValidator.pipe';

@Controller('admin/users')
@Roles(Role.ADMIN)
@UseGuards(AuthGaurd, RolesGuard)
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(UserValidator)
  async create(@Body() user: User): Promise<User> {
    const addedUser = await this.usersService.create(user);
    if (!addedUser) {
      throw new ConflictException(`user: ${user.username} already exists`);
    }
    return addedUser;
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException(`user: ${username} does not exist`);
    }
    return user;
  }

  @Put(':username')
  @UsePipes(UserValidator)
  async update(
    @Param('username') username: string,
    @Body() user: User,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(username, user);
    if (!updatedUser) {
      throw new NotFoundException(`user: ${username} does not exist`);
    }
    return updatedUser;
  }

  @Delete(':username')
  async remove(@Param('username') username: string): Promise<void> {
    const isDeleted = await this.usersService.remove(username);
    if (!isDeleted)
      throw new NotFoundException(`user: ${username} does not exist`);
  }
}
