import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export default class HashPasswordPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  async transform(value: string): Promise<string> {
    const salt = this.configService.getOrThrow<string>('ARGON_SALT');

    if (!salt) {
      const random: string = randomBytes(32).toString('hex');
      throw new Error(`Salt is not defined, use: ${random}`);
    }

    return await argon2.hash(value, {
      type: argon2.argon2id,
      salt: Buffer.from(salt, 'hex'),
      saltLength: 32,
    });
  }
}
