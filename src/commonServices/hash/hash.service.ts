import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  private readonly logger = new Logger(HashService.name);
  constructor(private readonly conf: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = this.conf.get<string>('ARGON_SALT');

    if (!salt) {
      const random: string = randomBytes(32).toString('hex');
      throw new Error(`ARGON_SALT is not defined, use: ${random}`);
    }

    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        salt: Buffer.from(salt, 'hex'),
        saltLength: 32,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const salt = this.conf.get<string>('ARGON_SALT');

    if (!salt) {
      const random: string = randomBytes(32).toString('hex');
      throw new Error(`ARGON_SALT is not defined, use: ${random}`);
    }
    try {
      return await argon2.verify(password, hash, {
        salt: Buffer.from(salt, 'hex'),
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
