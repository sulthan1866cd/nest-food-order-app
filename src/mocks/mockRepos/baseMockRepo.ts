import { randomUUID } from 'crypto';
import { IRepository } from 'src/interface/repository.interface';

export class BaseMockRepository<
  T extends { id: string },
> implements IRepository<T> {
  protected mocks: Promise<T[]>;

  constructor(mocks: Promise<T[]>) {
    this.mocks = mocks;
  }

  async create(entity: Partial<T>): Promise<T | null> {
    const newEntity = {
      ...entity,
      id: randomUUID(),
    } as T;
    (await this.mocks).push(newEntity);
    return this.findOneBy(entity);
  }

  async findBy(where?: Partial<T>): Promise<T[]> {
    if (!where) return this.mocks;
    return (await this.mocks).filter((mock) => {
      for (const key in where) {
        if (mock[key] !== where[key]) return false;
      }
      return true;
    });
  }

  async findOneBy(where: Partial<T>): Promise<T | null> {
    return (
      (await this.mocks).find((mock) => {
        for (const key in where) {
          if (mock[key] !== where[key]) return false;
        }
        return true;
      }) || null
    );
  }

  async update(entity: Partial<T>): Promise<T | null> {
    const fullEntity = await this.findOneBy({ id: entity.id } as T);
    if (!fullEntity) return null;
    for (const key in entity) {
      if (entity[key]) fullEntity[key] = entity[key];
    }
    const newMocks = (await this.mocks).map((mock) => {
      if (mock.id === fullEntity.id) return fullEntity;
      return mock;
    });
    this.mocks = Promise.resolve(newMocks);
    return this.findOneBy(fullEntity);
  }

  async deleteBy(where: Partial<T>): Promise<void> {
    const newMocks = (await this.mocks).filter((mock) => {
      for (const key in where) {
        if (mock[key] !== where[key]) return true;
      }
      return false;
    });
    this.mocks = Promise.resolve(newMocks);
  }
}
