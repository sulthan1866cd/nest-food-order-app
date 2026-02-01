import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class Validator<T> implements PipeTransform<Partial<T>, T> {
  protected ref: T;
  protected refStructure: T;
  constructor(ref: T) {
    this.ref = ref;
    this.refStructure = JSON.parse(this.getObjectStructure(ref)) as T;
  }

  protected getObjectStructure = (ref: T) => {
    const obj: Record<string, unknown> = {};
    for (const key in ref) {
      if (typeof ref[key] === 'object')
        obj[key] = this.getObjectStructure(ref[key] as T);
      else obj[key] = typeof ref[key];
    }
    return JSON.stringify(obj);
  };

  protected validateObject(value: Partial<T>, ref: Partial<T>, path = 'body') {
    for (const key in ref) {
      if (!value[key])
        throw new BadRequestException({
          error: 'Incomplete request object',
          expected: this.refStructure,
          missingKey: `${path}.${key}`,
        });

      if (typeof value[key] !== typeof ref[key])
        throw new BadRequestException({
          error: 'Incorrect request object type',
          expected: this.refStructure,
          incorrectKey: `${path}.${key}`,
          expectedType: typeof ref[key],
          actualType: typeof value[key],
        });

      if (typeof value[key] === 'object')
        this.validateObject(
          value[key],
          ref[key] as Partial<T>,
          `${path}.${key}`,
        );
    }
  }

  protected validateAndSetPositiveNumber(value: Partial<T>, key: keyof T) {
    const keyStr = key as string;
    value[keyStr] = Number(value[keyStr]);
    if (!isFinite(value[keyStr] as number) || value[keyStr] <= 0) {
      throw new BadRequestException(`${keyStr} must be a positive number`);
    }
  }

  transform(value: Partial<T>, metadata: ArgumentMetadata): T {
    if (metadata.type !== 'body') return value as T;
    if (!value)
      throw new BadRequestException({
        error: 'No body found',
        expected: this.refStructure,
      });
    this.validateObject(value, this.ref);
    return value as T;
  }
}
