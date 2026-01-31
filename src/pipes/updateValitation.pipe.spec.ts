import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UpdateValidator } from './updateValitation.pipe';

interface TestDto {
  username: string;
  age: number;
  email: string;
}

interface NestedTestDto {
  user: {
    name: string;
    age: number;
  };
  settings: {
    theme: string;
  };
}

describe('UpdateValidator', () => {
  let validator: UpdateValidator<TestDto>;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    validator = new UpdateValidator<TestDto>({
      username: '',
      age: 0,
      email: '',
    });
    metadata = {
      type: 'body',
      metatype: Object,
      data: '',
    };
  });

  describe('constructor', () => {
    it('should initialize with reference structure', () => {
      expect(validator['ref']).toBeDefined();
      expect(validator['refStructure']).toBeDefined();
    });

    it('should inherit from Validator', () => {
      const refStructure = validator['refStructure'] as unknown as Record<
        string,
        string
      >;
      expect(refStructure.username).toBe('string');
      expect(refStructure.age).toBe('number');
      expect(refStructure.email).toBe('string');
    });
  });

  describe('transform()', () => {
    it('should return value unchanged when metadata type is not body', () => {
      const value = { username: 'test' };
      const paramMetadata = { ...metadata, type: 'param' as const };

      const result = validator.transform(value, paramMetadata);

      expect(result).toEqual(value);
    });

    it('should accept partial update with single field', () => {
      const value = { username: 'test' };

      const result = validator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should accept partial update with multiple fields', () => {
      const value = { username: 'test', email: 'test@test.com' };

      const result = validator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should accept update with all fields', () => {
      const value = { username: 'test', age: 25, email: 'test@test.com' };

      const result = validator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should throw error when no valid fields provided', () => {
      const value = { invalidField: 'test' };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should throw error with correct message when no valid fields', () => {
      const value = { invalidField: 'test' };

      try {
        validator.transform(value as unknown as Partial<TestDto>, metadata);
      } catch (error) {
        expect((error as BadRequestException).getResponse()).toMatchObject({
          error:
            'At least one of the expected fields must be provided to update',
          expected: expect.anything() as Record<string, unknown>,
        });
      }
    });

    it('should throw error when only invalid fields provided', () => {
      const value = { invalid1: 'test', invalid2: 123 };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should throw error when invalid field has different type than any ref field', () => {
      // Since 'invalidField' doesn't exist in ref, typeof ref[key] is undefined
      // and typeof 'ignored' is 'string', which are different
      const value = { username: 'test', invalidField: 'ignored' };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });
  });

  describe('validateObject()', () => {
    it('should not throw error for missing fields (partial update)', () => {
      const value = { username: 'test' };

      const result = validator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should throw error when field type is incorrect', () => {
      const value = { username: 123 };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should throw error with type information', () => {
      const value = { age: '25' };

      try {
        validator.transform(value as unknown as Partial<TestDto>, metadata);
      } catch (error) {
        expect((error as BadRequestException).getResponse()).toMatchObject({
          error: 'Incorrect request object type',
          incorrectKey: 'body.age',
          expectedType: 'number',
          actualType: 'string',
        });
      }
    });

    it('should accept non-empty values', () => {
      const value = { username: 'user', age: 1 };

      const result = validator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should throw error for incorrect type even if falsy', () => {
      const value = { username: false };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should validate nested objects for partial updates', () => {
      const nestedValidator = new UpdateValidator<NestedTestDto>({
        user: {
          name: '',
          age: 0,
        },
        settings: {
          theme: '',
        },
      });

      const value = {
        user: {
          name: 'John',
          age: 30,
        },
      };

      const result = nestedValidator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should throw error for incorrect type in nested object', () => {
      const nestedValidator = new UpdateValidator<NestedTestDto>({
        user: {
          name: '',
          age: 0,
        },
        settings: {
          theme: '',
        },
      });

      const value = {
        user: {
          name: 'John',
          age: '30',
        },
      };

      try {
        nestedValidator.transform(
          value as unknown as Partial<NestedTestDto>,
          metadata,
        );
      } catch (error) {
        expect((error as BadRequestException).getResponse()).toMatchObject({
          error: 'Incorrect request object type',
          incorrectKey: 'body.user.age',
        });
      }
    });

    it('should accept partial nested object', () => {
      const nestedValidator = new UpdateValidator<NestedTestDto>({
        user: {
          name: '',
          age: 0,
        },
        settings: {
          theme: '',
        },
      });

      const value = {
        user: {
          name: 'John',
        },
      };

      const result = nestedValidator.transform(
        value as unknown as Partial<NestedTestDto>,
        metadata,
      );

      expect(result.user?.name).toBe('John');
    });
  });

  describe('edge cases', () => {
    it('should handle empty object', () => {
      const value = {};

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should handle null values', () => {
      const value = { username: null };

      // null is object type in JavaScript
      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should handle undefined values in update', () => {
      const value = { username: undefined };

      // undefined will not be enumerated in for...in loop
      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should allow multiple fields update', () => {
      const value = { username: 'newuser', age: 30, email: 'new@test.com' };

      const result = validator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should validate each provided field independently', () => {
      const value1 = { username: 'test' };
      const value2 = { age: 25 };
      const value3 = { email: 'test@test.com' };

      expect(validator.transform(value1, metadata)).toEqual(value1);
      expect(validator.transform(value2, metadata)).toEqual(value2);
      expect(validator.transform(value3, metadata)).toEqual(value3);
    });
  });

  describe('comparison with Validator', () => {
    it('should not require all fields unlike base Validator', () => {
      const value = { username: 'test' }; // missing age and email

      // UpdateValidator should accept this
      const result = validator.transform(value, metadata);
      expect(result).toEqual(value);
    });

    it('should still validate type correctness like base Validator', () => {
      const value = { username: 123 }; // wrong type

      // Both should reject this
      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });
  });
});
