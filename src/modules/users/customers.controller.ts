import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UsePipes,
  UseGuards,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGaurd } from '../../gurds/auth.guard';
import { Role } from 'src/gurds/role.enum';
import { UserValidator } from './pipe/userValidator.pipe';

@Controller('users')
export class CustomersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(UserValidator)
  async create(@Body() user: User): Promise<User> {
    if (user.role !== Role.CUSTOMER)
      throw new ForbiddenException('only admins can create chef/admin user');
    const addedUser = await this.usersService.create(user);
    if (!addedUser)
      throw new ConflictException(`user: ${user.username} already exists`);

    return addedUser;
  }

  @Get(':username')
  @UseGuards(AuthGaurd)
  async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException(`user: ${username} does not exist`);
    }
    return user;
  }

  @Put(':username')
  @UsePipes(UserValidator)
  @UseGuards(AuthGaurd)
  async update(
    @Param('username') username: string,
    @Body() user: User,
  ): Promise<User> {
    if (user.role !== Role.CUSTOMER)
      throw new ForbiddenException('only admins can create chef/admin user');
    const updatedUser = await this.usersService.update(username, user);
    if (!updatedUser) {
      throw new NotFoundException(`user: ${username} does not exist`);
    }
    return updatedUser;
  }

  // @Delete(':username')
  // @UseGuards(AuthGaurd)
  // async remove(@Param('username') username: string) {
  //   const isDeleted = await this.usersService.remove(username);
  //   if (!isDeleted)
  //     throw new NotFoundException(`user: ${username} does not exist`);
  // }
}
