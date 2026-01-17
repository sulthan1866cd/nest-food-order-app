import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { type IAuthService } from 'src/interface/authService.interface';
import { ClientUserDto, CreateUserDto, UpdateUserDto } from './dto/users.dto.';
import { Role } from 'src/gurds/role.enum';
import { HashService } from '../auth/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: IRepository<User>,
    @Inject(forwardRef(() => 'AuthService'))
    private readonly authService: IAuthService,
    private readonly hashService: HashService,
  ) {}

  async create(user: CreateUserDto): Promise<ClientUserDto | null> {
    if (await this.isExists(user)) return null;
    user.password = await this.hashService.hash(user.password);
    const newUser = (await this.userRepo.create(user)) as User;
    const authorization = this.authService.generateToken(newUser);
    return { ...newUser, authorization };
  }

  async createCustomer(user: CreateUserDto) {
    return this.create({ ...user, role: Role.CUSTOMER });
  }

  findAll(): Promise<User[]> {
    return this.userRepo.findBy();
  }

  findOne(username: string): Promise<User | null> {
    return this.userRepo.findOneBy({ username });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  findOneCustomer(username: string) {
    return this.userRepo.findOneBy({ username, role: Role.CUSTOMER });
  }

  async update(username: string, user: UpdateUserDto): Promise<User | null> {
    const newUser = { ...user, username };
    const existingUser = await this.findOne(username);
    if (!existingUser) return null;
    if (user.email) {
      const existingUserWithCurrentEmail = await this.findOneByEmail(
        user.email,
      );
      if (
        existingUserWithCurrentEmail &&
        existingUserWithCurrentEmail.username !== username
      )
        throw new ConflictException('Email already exists for another user');
    }
    if (user.password) {
      newUser.password = await this.hashService.hash(user.password);
    }
    return await this.userRepo.update({ ...newUser, id: existingUser.id });
  }

  async updateCustomer(
    username: string,
    user: UpdateUserDto,
  ): Promise<User | null> {
    const newUser = { ...user, username };
    const existingUser = await this.findOneCustomer(username);
    if (!existingUser) return null;
    if (user.email) {
      const existingUserWithCurrentEmail = await this.findOneByEmail(
        user.email,
      );
      if (
        existingUserWithCurrentEmail &&
        existingUserWithCurrentEmail.username !== username
      )
        throw new ConflictException('Email already exists for another user');
    }
    if (user.password) {
      newUser.password = await this.hashService.hash(user.password);
    }
    return await this.userRepo.update({
      ...newUser,
      role: Role.CUSTOMER,
      id: existingUser.id,
    });
  }

  async remove(username: string): Promise<boolean> {
    if (!(await this.isExists(username))) return false;
    await this.userRepo.deleteBy({ username });
    return true;
  }

  async removeCustomer(username: string): Promise<boolean> {
    if (!(await this.findOneCustomer(username))) return false;
    await this.userRepo.deleteBy({ username, role: Role.CUSTOMER });
    return true;
  }

  async isExists(checkUser: User | CreateUserDto | string): Promise<boolean> {
    if (typeof checkUser === 'string')
      return (await this.findAll()).some((user) => user.username === checkUser);

    return (await this.findAll()).some(
      (user) =>
        user.username === checkUser.username ||
        user.id === checkUser['id'] ||
        user.email === checkUser.email,
    );
  }
}
