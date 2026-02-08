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
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { Role } from 'src/guards/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  CreateUserValidator,
  UpdateUserValidator,
} from './pipe/userValidator.pipe';
import { ClientUserDto, CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { UserInterceptor } from './interceptor/user.interceptor';
import { User } from './entities/user.entity';
import { UsersInterceptor } from './interceptor/users.interceptor';

@Controller('super-admin/users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class SuperAdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(CreateUserValidator)
  @UseInterceptors(UserInterceptor)
  async create(@Body() user: CreateUserDto): Promise<ClientUserDto> {
    const addedUser = await this.usersService.create(user);
    if (!addedUser)
      throw new ConflictException(`user: ${user.username} already exists`);

    return addedUser;
  }

  @Get()
  @UseInterceptors(UsersInterceptor)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':username')
  @UseInterceptors(UserInterceptor)
  async findOne(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new NotFoundException(`user: ${username} does not exist`);

    return user;
  }

  @Put(':username')
  @UsePipes(UpdateUserValidator)
  @UseInterceptors(UserInterceptor)
  async update(
    @Param('username') username: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.update(username, user);
    if (!updatedUser)
      throw new NotFoundException(`user: ${username} does not exist`);

    return updatedUser;
  }

  @Delete(':username')
  async remove(@Param('username') username: string): Promise<void> {
    const isDeleted = await this.usersService.remove(username);
    if (!isDeleted)
      throw new NotFoundException(`user: ${username} does not exist`);
  }
}
