import { randomUUID, UUID } from 'crypto';
import { BaseMockRepository } from './baseMockRepo';

interface TestEntity {
  id: UUID;
  name: string;
  age: number;
  role: string;
}

describe('BaseMockRepository', () => {
  let repository: BaseMockRepository<TestEntity>;
  let mockData: TestEntity[];

  beforeEach(() => {
    mockData = [
      {
        id: randomUUID(),
        name: 'John Doe',
        age: 30,
        role: 'admin',
      },
      {
        id: randomUUID(),
        name: 'Jane Smith',
        age: 25,
        role: 'user',
      },
      {
        id: randomUUID(),
        name: 'Bob Johnson',
        age: 35,
        role: 'user',
      },
    ];
    repository = new BaseMockRepository(Promise.resolve([...mockData]));
  });

  describe('create()', () => {
    it('should create a new entity and return it', async () => {
      const newEntity = {
        name: 'Alice Williams',
        age: 28,
        role: 'moderator',
      };

      const created = await repository.create(newEntity);

      expect(created).toBeDefined();
      expect(created?.name).toBe(newEntity.name);
      expect(created?.age).toBe(newEntity.age);
      expect(created?.role).toBe(newEntity.role);
      expect(created?.id).toBeDefined();
    });

    it('should add the created entity to the repository', async () => {
      const newEntity = {
        name: 'Charlie Brown',
        age: 40,
        role: 'guest',
      };

      await repository.create(newEntity);
      const allEntities = await repository.findBy();

      expect(allEntities).toHaveLength(4);
    });
  });

  describe('findBy()', () => {
    it('should return all entities when no filter is provided', async () => {
      const entities = await repository.findBy();

      expect(entities).toHaveLength(3);
      expect(entities).toEqual(expect.arrayContaining(mockData));
    });

    it('should filter entities with AND logic by default', async () => {
      const entities = await repository.findBy({ role: 'user' });

      expect(entities).toHaveLength(2);
      expect(entities.every((e) => e.role === 'user')).toBe(true);
    });

    it('should filter entities with multiple criteria using AND logic', async () => {
      const entities = await repository.findBy({ role: 'user', age: 25 });

      expect(entities).toHaveLength(1);
      expect(entities[0].name).toBe('Jane Smith');
    });

    it('should filter entities with OR logic when isOr is true', async () => {
      const entities = await repository.findBy(
        { name: 'John Doe', age: 25 },
        true,
      );

      expect(entities).toHaveLength(2);
      expect(entities.map((e) => e.name)).toContain('John Doe');
      expect(entities.map((e) => e.name)).toContain('Jane Smith');
    });

    it('should return empty array when no match found', async () => {
      const entities = await repository.findBy({ name: 'Unknown' });

      expect(entities).toHaveLength(0);
    });
  });

  describe('findOneBy()', () => {
    it('should find entity by id', async () => {
      const entity = await repository.findOneBy({ id: mockData[0].id });

      expect(entity).toEqual(mockData[0]);
    });

    it('should find entity by name', async () => {
      const entity = await repository.findOneBy({ name: 'Jane Smith' });

      expect(entity).toBeDefined();
      expect(entity?.name).toBe('Jane Smith');
    });

    it('should find entity with AND logic by default', async () => {
      const entity = await repository.findOneBy({
        name: 'Bob Johnson',
        age: 35,
      });

      expect(entity).toBeDefined();
      expect(entity?.name).toBe('Bob Johnson');
    });

    it('should not find entity when one criterion does not match with AND logic', async () => {
      const entity = await repository.findOneBy({
        name: 'Bob Johnson',
        age: 25,
      });

      expect(entity).toBeNull();
    });

    it('should find entity with OR logic when isOr is true', async () => {
      const entity = await repository.findOneBy(
        { name: 'John Doe', age: 25 },
        true,
      );

      expect(entity).toBeDefined();
      expect(['John Doe', 'Jane Smith']).toContain(entity?.name);
    });

    it('should return null when no match found', async () => {
      const entity = await repository.findOneBy({ name: 'Unknown' });

      expect(entity).toBeNull();
    });
  });

  describe('isExists()', () => {
    it('should return true when entity exists', async () => {
      const exists = await repository.isExists({ name: 'John Doe' });

      expect(exists).toBe(true);
    });

    it('should return false when entity does not exist', async () => {
      const exists = await repository.isExists({ name: 'Unknown' });

      expect(exists).toBe(false);
    });

    it('should work with OR logic', async () => {
      const exists = await repository.isExists(
        { name: 'John Doe', age: 999 },
        true,
      );

      expect(exists).toBe(true);
    });

    it('should work with AND logic', async () => {
      const exists = await repository.isExists({
        name: 'John Doe',
        role: 'admin',
      });

      expect(exists).toBe(true);
    });
  });

  describe('update()', () => {
    it('should update an existing entity', async () => {
      const updatedEntity = {
        id: mockData[0].id,
        name: 'John Updated',
        age: 31,
      };

      const result = await repository.update(updatedEntity);

      expect(result).toBeDefined();
      expect(result?.name).toBe('John Updated');
      expect(result?.age).toBe(31);
      expect(result?.role).toBe('admin'); // unchanged
    });

    it('should persist the update in the repository', async () => {
      const updatedEntity = {
        id: mockData[1].id,
        name: 'Jane Updated',
      };

      await repository.update(updatedEntity);
      const entity = await repository.findOneBy({ id: mockData[1].id });

      expect(entity?.name).toBe('Jane Updated');
      expect(entity?.age).toBe(25); // unchanged
    });

    it('should return null when entity does not exist', async () => {
      const result = await repository.update({
        id: randomUUID(),
        name: 'Non-existent',
      });

      expect(result).toBeNull();
    });

    it('should not update fields with falsy values', async () => {
      const updatedEntity = {
        id: mockData[0].id,
        age: 0, // falsy value
      };

      await repository.update(updatedEntity);
      const entity = await repository.findOneBy({ id: mockData[0].id });

      expect(entity?.age).toBe(30); // should remain unchanged
    });
  });

  describe('deleteBy()', () => {
    it('should delete entity by id', async () => {
      await repository.deleteBy({ id: mockData[0].id });
      const entities = await repository.findBy();

      expect(entities).toHaveLength(2);
      expect(entities.find((e) => e.id === mockData[0].id)).toBeUndefined();
    });

    it('should delete entities matching criteria with AND logic', async () => {
      await repository.deleteBy({ role: 'user', age: 25 });
      const entities = await repository.findBy();

      expect(entities).toHaveLength(2);
      expect(entities.find((e) => e.name === 'Jane Smith')).toBeUndefined();
    });

    it('should delete entities matching criteria with OR logic', async () => {
      await repository.deleteBy({ name: 'John Doe', age: 25 }, true);
      const entities = await repository.findBy();

      expect(entities).toHaveLength(1);
      expect(entities[0].name).toBe('Bob Johnson');
    });

    it('should delete all matching entities with OR logic', async () => {
      await repository.deleteBy({ role: 'admin', name: 'Bob Johnson' }, true);
      const entities = await repository.findBy();

      expect(entities).toHaveLength(1);
      expect(entities[0].name).toBe('Jane Smith');
    });

    it('should not delete anything when no match found', async () => {
      await repository.deleteBy({ name: 'Unknown' });
      const entities = await repository.findBy();

      expect(entities).toHaveLength(3);
    });
  });
});
