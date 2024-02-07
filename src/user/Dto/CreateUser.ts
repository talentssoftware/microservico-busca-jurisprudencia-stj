import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserUnique } from '../validator/userUniqueValidator';

export class CreateUserDto {
  @Exclude({ toClassOnly: true })
  id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @UserUnique({ message: 'Email em uso' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  roleId?: number;

  @Exclude()
  imageUrl?: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
