import { Module } from '@nestjs/common';
import { UsuarioController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserUniqueValidator } from './validator/userUniqueValidator';

import { JwtStrategy } from '@/commonServices/auth/strategies/jwt.strategy';
import { HashModule } from '@/commonServices/hash/hash.module';

@Module({
  controllers: [UsuarioController],
  providers: [UserRepository, UserUniqueValidator, JwtStrategy],
  exports: [UserRepository],
  imports: [HashModule],
})
export class UserModule {}
