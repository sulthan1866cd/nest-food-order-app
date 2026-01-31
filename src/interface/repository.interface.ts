import { UUID } from 'crypto';

export interface IRepository<T> {
  create(entity: Partial<T>): Promise<T | null>;
  findBy(where?: Partial<T>, isOr?: boolean): Promise<T[]>;
  isExists(where: Partial<T>, isOr?: boolean): Promise<boolean>;
  findOneBy(where: Partial<T>, isOr?: boolean): Promise<T | null>;
  update(entity: Partial<T> & { id: UUID }): Promise<T | null>;
  deleteBy(where: Partial<T>, isOr?: boolean): Promise<void>;
}
