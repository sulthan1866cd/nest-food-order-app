import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class Validator<T> implements PipeTransform<Partial<T>, T> {
  private ref: T;
  constructor(ref: T) {
    this.ref = ref;
  }

  protected getObjectStructure = (ref: T) => {
    const obj: Record<string, unknown> = {};
    for (const key in ref) {
      if (typeof ref[key] === 'object')
        obj[key] = this.getObjectStructure(ref[key] as T);
      else obj[key] = typeof ref[key];
    }
    return JSON.stringify(obj).replaceAll('"', '');
  };

  private validateObject(value: Partial<T>, ref: Partial<T>, path = 'body') {
    for (const key in ref) {
      if (!value[key])
        throw new BadRequestException(
          `Incomplete request object, missing key: ${path}.${key}`,
        );
      if (typeof value[key] !== typeof ref[key])
        throw new BadRequestException(
          `Incorrect request object type=> 
            key: ${path}.${key}, 
            Expected type: ${typeof ref[key]}, 
            Actual type: ${typeof value[key]}`,
        );

      if (typeof value[key] === 'object')
        this.validateObject(
          value[key],
          ref[key] as Partial<T>,
          `${path}.${key}`,
        );
    }
  }

  transform(value: Partial<T>, metadata: ArgumentMetadata): T {
    if (metadata.type !== 'body') return value as T;
    if (!value)
      throw new BadRequestException(
        `no body found, expected body of type: ${this.getObjectStructure(this.ref)}`,
      );
    this.validateObject(value, this.ref);
    return value as T;
  }
}
