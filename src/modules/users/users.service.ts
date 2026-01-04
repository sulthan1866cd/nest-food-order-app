import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { type IAuthService } from 'src/interface/authService.interface';
import { ClientUserDto, CreateUserDto, UpdateUserDto } from './dto/users.dto.';
import { Role } from 'src/gurds/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: IRepository<User>,
    @Inject(forwardRef(() => 'AuthService'))
    private readonly authService: IAuthService,
  ) {}

  async create(user: CreateUserDto): Promise<ClientUserDto | null> {
    if (await this.isExists(user)) return null;
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
    if (!(await this.isExists(username))) return null;
    return await this.userRepo.update(newUser);
  }

  async updateCustomer(
    username: string,
    user: UpdateUserDto,
  ): Promise<User | null> {
    const newUser = { ...user, username };
    if (!(await this.findOneCustomer(username))) return null;
    return await this.userRepo.update(newUser);
  }

  async remove(username: string): Promise<boolean> {
    if (!(await this.isExists(username))) return false;
    await this.userRepo.deleteBy({ username });
    return true;
  }

  async isExists(checkUser: User | CreateUserDto | string): Promise<boolean> {
    if (typeof checkUser === 'string')
      return (await this.findAll()).some((user) => user.username === checkUser);

    return (await this.findAll()).some(
      (user) =>
        user.username === checkUser.username ||
        // (checkUser instanceof User && user.id === checkUser.id) ||
        user.email === checkUser.email,
    );
  }
}
