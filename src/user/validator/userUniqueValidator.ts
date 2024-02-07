import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/commonServices/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class UserUniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: value },
    });
    return !user;
  }
}

export const UserUnique = (options?: ValidationOptions) => {
  return (obj: object, prop: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName: prop,
      options: options,
      constraints: [],
      validator: UserUniqueValidator,
    });
  };
};
