import { BadRequestException, PipeTransform } from '@nestjs/common';

export class Validator<T> implements PipeTransform<Partial<T>, T> {
  private ref: Omit<T, 'id'>;
  constructor(ref: Omit<T, 'id'>) {
    this.ref = ref;
  }

  private expectedObjectStructure = (() => {
    const obj = {};
    for (const key in this.ref) {
      obj[key] = typeof this.ref[key];
    }
    return JSON.stringify(obj);
  })();

  transform(value: Partial<T>): T {
    if (!value)
      throw new BadRequestException(
        `no body found, expected body of type ${this.expectedObjectStructure}`,
      );
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
