import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { type IRepository } from 'src/interface/repository.interface';
import { type IAuthService } from 'src/modules/auth/interfaces/authService.interface';
import { ClientUserDto, CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { Role } from 'src/guards/role.enum';
import { HashService } from '../auth/hash.service';
import { UUID } from 'crypto';
import { ShopsService } from '../shops/shops.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: IRepository<User>,
    @Inject(forwardRef(() => 'AuthService'))
    private readonly authService: IAuthService,
    private readonly hashService: HashService,
    protected readonly shopService: ShopsService,
  ) {}

  async create(user: CreateUserDto): Promise<ClientUserDto | null> {
    if (await this.isExists(user)) return null;
    user.password = await this.hashService.hash(user.password);
    const newUser = (await this.userRepo.create(user)) as User;
    const authorization = this.authService.generateToken(newUser);
    return { ...newUser, authorization };
  }

  async createUserInMall(
    user: CreateUserDto,
    mallId: UUID,
    shopId?: UUID,
  ): Promise<ClientUserDto | null> {
    if (user.role === Role.SUPER_ADMIN)
      throw new ConflictException('Super Admin cannot be created in a mall');
    return this.create({ ...user, mallId, shopId });
  }

  createCustomer(user: CreateUserDto) {
    return this.create({ ...user, role: Role.CUSTOMER });
  }

  findAll(): Promise<User[]> {
    return this.userRepo.findBy();
  }

  findAllInMall(mallId: UUID): Promise<User[]> {
    return this.userRepo.findBy({ mallId });
  }

  findOne(username: string): Promise<User | null> {
    return this.userRepo.findOneBy({ username });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  findOneByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return this.userRepo.findOneBy({ username, email }, true);
  }

  findOneInMall(username: string, mallId: UUID): Promise<User | null> {
    return this.userRepo.findOneBy({ username, mallId });
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
    return this.userRepo.update({ ...newUser, id: existingUser.id });
  }

  async updateInMall(
    username: string,
    user: UpdateUserDto,
    mallId: UUID,
  ): Promise<User | null> {
    const existingUser = await this.findOneInMall(username, mallId);
    if (!existingUser) return null;
    return this.update(username, { ...user, mallId });
  }

  async updateCustomer(
    username: string,
    user: UpdateUserDto,
  ): Promise<User | null> {
    const existingUser = await this.findOneCustomer(username);
    if (!existingUser) return null;
    return this.update(username, user);
  }

  async remove(username: string): Promise<boolean> {
    if (!(await this.isExists(username))) return false;
    await this.userRepo.deleteBy({ username });
    return true;
  }

  async removeInMall(username: string, mallId: UUID): Promise<boolean> {
    if (!(await this.findOneInMall(username, mallId))) return false;
    await this.userRepo.deleteBy({ username, mallId });
    return true;
  }

  async removeCustomer(username: string): Promise<boolean> {
    if (!(await this.findOneCustomer(username))) return false;
    await this.userRepo.deleteBy({ username, role: Role.CUSTOMER });
    return true;
  }

  isExists(checkUser: User | CreateUserDto | string): Promise<boolean> {
    if (typeof checkUser === 'string')
      return this.userRepo.isExists({ username: checkUser });

    return this.userRepo.isExists(
      {
        username: checkUser.username,
        email: checkUser.email,
        id: 'id' in checkUser ? checkUser.id : undefined,
      },
      true,
    );
  }
}
