import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Validator } from './validation.pipe';

export class UpdateValidator<T> extends Validator<Partial<T>> {
  constructor(ref: T) {
    super(ref);
  }

  validateObject(value: Partial<T>, ref: Partial<T>, path = 'body') {
    for (const key in value) {
      if (ref[key] && typeof value[key] !== typeof ref[key])
        throw new BadRequestException({
          error: 'Incorrect request object type',
          expected: this.refStructure,
          incorrectKey: `${path}.${key}`,
          expectedType: typeof ref[key],
          actualType: typeof value[key],
        });

      if (typeof value[key] === 'object' && ref[key])
        this.validateObject(
          value[key] as Partial<T>,
          ref[key] as Partial<T>,
          `${path}.${key}`,
        );
    }
  }

  transform(value: Partial<T>, metadata: ArgumentMetadata): Partial<T> {
    if (metadata.type !== 'body') return value as T;
    for (const key in value) {
      if (Object.keys(this.ref).includes(key)) {
        this.validateObject(value, this.ref);
        return Object.keys(this.ref).reduce((acc, curr) => {
          if (curr in this.ref) acc[curr] = value[curr];
          return acc;
        }, {});
      }
    }
    throw new BadRequestException({
      error: 'At least one of the expected fields must be provided to update',
      expected: this.refStructure,
    });
  }
}
