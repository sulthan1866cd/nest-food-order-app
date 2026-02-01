import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Validator } from './validation.pipe';

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

describe('Validator', () => {
  let validator: Validator<TestDto>;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    validator = new Validator<TestDto>({
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

    it('should generate correct structure for simple types', () => {
      const refStructure = validator['refStructure'] as unknown as Record<
        string,
        string
      >;
      expect(refStructure.username).toBe('string');
      expect(refStructure.age).toBe('number');
      expect(refStructure.email).toBe('string');
    });
  });

  describe('getObjectStructure()', () => {
    it('should generate structure for nested objects', () => {
      const nestedValidator = new Validator<NestedTestDto>({
        user: {
          name: '',
          age: 0,
        },
        settings: {
          theme: '',
        },
      });

      const structure = nestedValidator['refStructure'] as unknown as Record<
        string,
        unknown
      >;
      expect(structure.user).toBeDefined();
      expect(structure.settings).toBeDefined();
    });
  });

  describe('validateAndSetPositiveNumber()', () => {
    it('should convert string to positive number', () => {
      const value: Partial<TestDto> = { age: '25' as unknown as number };
      validator['validateAndSetPositiveNumber'](value, 'age');
      expect(value.age).toBe(25);
    });

    it('should throw error for non-positive numbers', () => {
      const value: Partial<TestDto> = { age: '-5' as unknown as number };
      expect(() =>
        validator['validateAndSetPositiveNumber'](value, 'age'),
      ).toThrow(BadRequestException);
    });

    it('should throw error for non-numeric values', () => {
      const value: Partial<TestDto> = { age: 'abc' as unknown as number };
      expect(() =>
        validator['validateAndSetPositiveNumber'](value, 'age'),
      ).toThrow(BadRequestException);
    });
  });

  describe('transform()', () => {
    it('should return value unchanged when metadata type is not body', () => {
      const value = { username: 'test', age: 25, email: 'test@test.com' };
      const paramMetadata = { ...metadata, type: 'param' as const };

      const result = validator.transform(value, paramMetadata);

      expect(result).toEqual(value);
    });

    it('should validate and return value when valid', () => {
      const value = { username: 'test', age: 25, email: 'test@test.com' };

      const result = validator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should throw BadRequestException when value is undefined', () => {
      expect(() =>
        validator.transform(undefined as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when value is null', () => {
      expect(() =>
        validator.transform(null as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should throw error with correct structure when no body found', () => {
      try {
        validator.transform(null as unknown as Partial<TestDto>, metadata);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).getResponse()).toMatchObject({
          error: 'No body found',
          expected: expect.anything() as Record<string, unknown>,
        });
      }
    });
  });

  describe('validateObject()', () => {
    it('should throw error when required field is missing', () => {
      const value = { username: 'test', email: 'test@test.com' };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should throw error with missing key information', () => {
      const value = { username: 'test', email: 'test@test.com' };

      try {
        validator.transform(value as unknown as Partial<TestDto>, metadata);
      } catch (error) {
        expect((error as BadRequestException).getResponse()).toMatchObject({
          error: 'Incomplete request object',
          missingKey: 'body.age',
        });
      }
    });

    it('should throw error when field type is incorrect', () => {
      const value = { username: 'test', age: '25', email: 'test@test.com' };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });

    it('should throw error with type information', () => {
      const value = { username: 'test', age: '25', email: 'test@test.com' };

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

    it('should validate nested objects', () => {
      const nestedValidator = new Validator<NestedTestDto>({
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
        settings: {
          theme: 'dark',
        },
      };

      const result = nestedValidator.transform(value, metadata);

      expect(result).toEqual(value);
    });

    it('should throw error for missing nested field', () => {
      const nestedValidator = new Validator<NestedTestDto>({
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
        settings: {
          theme: 'dark',
        },
      };

      try {
        nestedValidator.transform(
          value as unknown as Partial<NestedTestDto>,
          metadata,
        );
      } catch (error) {
        expect((error as BadRequestException).getResponse()).toMatchObject({
          error: 'Incomplete request object',
          missingKey: 'body.user.age',
        });
      }
    });

    it('should throw error for incorrect type in nested object', () => {
      const nestedValidator = new Validator<NestedTestDto>({
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
        settings: {
          theme: 'dark',
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

    it('should reject falsy values as missing fields', () => {
      const value = { username: '', age: 0, email: '' };

      // Validator treats falsy values as missing
      expect(() => validator.transform(value, metadata)).toThrow(
        BadRequestException,
      );
    });

    it('should reject false when expecting string', () => {
      const value = { username: false, age: 0, email: '' };

      expect(() =>
        validator.transform(value as unknown as Partial<TestDto>, metadata),
      ).toThrow(BadRequestException);
    });
  });
});
