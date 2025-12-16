import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { type IRepository } from 'src/interface/repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: IRepository<User>,
  ) {}

  async create(user: User): Promise<User | null> {
    if (await this.isExists(user)) return null;
    return await this.userRepo.create(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepo.findBy();
  }

  async findOne(username: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ username });
  }

  async update(username: string, user: User): Promise<User | null> {
    const newUser = { ...user, username };
    if (!(await this.isExists(newUser))) return null;
    return await this.userRepo.update(newUser);
  }

  async remove(username: string): Promise<boolean> {
    if (!(await this.isExists(username))) return false;
    await this.userRepo.deleteBy({ username });
    return true;
  }

  async isExists(checkUser: User | string): Promise<boolean> {
    if (typeof checkUser === 'string')
      return !!(await this.findAll()).find(
        (user) => user.username === checkUser,
      );
    return !!(await this.findAll()).find(
      (user) =>
        user.username === checkUser.username ||
        user.id === checkUser.id ||
        user.email === checkUser.email,
    );
  }
}
