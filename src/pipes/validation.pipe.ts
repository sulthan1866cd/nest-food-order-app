import { BadRequestException, PipeTransform } from '@nestjs/common';

export class Validator<T> implements PipeTransform<Partial<T>, T> {
  protected ref: Omit<T, 'id'>;
  constructor(ref: Omit<T, 'id'>) {
    this.ref = ref;
  }
  transform(value: Partial<T>): T {
    for (const key in this.ref) {
      if (!value[key])
        throw new BadRequestException(
          `Incomplete request object, missing key:${key}`,
        );
      if (typeof value[key] !== typeof this.ref[key])
        throw new BadRequestException(
          `Incorrect request object type=> 
            key:${key}, 
            Expected type:${typeof this.ref[key]}, 
            Actual type:${typeof value[key]}`,
        );
    }
    return value as T;
  }
}
