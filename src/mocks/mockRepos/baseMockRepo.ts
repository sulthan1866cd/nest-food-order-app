import { randomUUID, UUID } from 'crypto';
import { IRepository } from 'src/interface/repository.interface';

export class BaseMockRepository<
  T extends { id: UUID },
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

  async findBy(where?: Partial<T>, isOr: boolean = false): Promise<T[]> {
    if (!where) return this.mocks;
    return (await this.mocks).filter((mock) =>
      isOr
        ? Object.keys(where).some((key) => mock[key] === where[key])
        : Object.keys(where).every((key) => mock[key] === where[key]),
    );
  }

  async isExists(where: Partial<T>, isOr: boolean = false): Promise<boolean> {
    return !!(await this.findOneBy(where, isOr));
  }

  async findOneBy(where: Partial<T>, isOr: boolean = false): Promise<T | null> {
    return (
      (await this.mocks).find((mock) =>
        isOr
          ? Object.keys(where).some((key) => mock[key] === where[key])
          : Object.keys(where).every((key) => mock[key] === where[key]),
      ) || null
    );
  }

  async update(entity: Partial<T> & { id: UUID }): Promise<T | null> {
    const fullEntity = await this.findOneBy({ id: entity.id } as T);
    if (!fullEntity) return null;
    for (const key in entity) {
      if (entity[key]) fullEntity[key] = entity[key] as T[keyof T];
    }
    const newMocks = (await this.mocks).map((mock) => {
      if (mock.id === fullEntity.id) return fullEntity;
      return mock;
    });
    this.mocks = Promise.resolve(newMocks);
    return this.findOneBy(fullEntity);
  }

  async deleteBy(where: Partial<T>, isOr: boolean = false): Promise<void> {
    const newMocks = (await this.mocks).filter((mock) =>
      isOr
        ? !Object.keys(where).some((key) => mock[key] === where[key])
        : !Object.keys(where).every((key) => mock[key] === where[key]),
    );
    this.mocks = Promise.resolve(newMocks);
  }
}
