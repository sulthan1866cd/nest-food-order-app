export interface IRepository<T> {
  create(entity: Partial<T>): Promise<T | null>;
  findBy(where?: Partial<T>): Promise<T[]>;
  findOneBy(where: Partial<T>): Promise<T | null>;
  update(entity: Partial<T> & { id: string }): Promise<T | null>;
  deleteBy(where: Partial<T>): Promise<void>;
}
