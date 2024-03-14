import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './AuthController';
import { ConfigService } from '@nestjs/config';
import { HashModule } from '@/commonServices/hash/hash.module';
import { RoleModule } from '@/role/role.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      useFactory: (conf: ConfigService) => ({
        secret: conf.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: conf.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    HashModule,
    RoleModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
