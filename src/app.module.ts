import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { FitroDeExcecaoHttp } from '@/commonServices/exception-http.filter';
import { ThrottlerBehindProxyGuard } from '@/commonServices/throttler-behind-proxy.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { environments } from '@/environments';
import {
  REQUEST_ID_HEADER,
  RequestIdMiddleware,
} from '@/commonServices/request-id/request-id.middleware';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '@/commonServices/auth/auth.module';
import { DatabaseModule } from '@/commonServices/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from '@/commonServices/events/event.module';
import { JstjModule } from './jstj/jstj.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Define o arquivo de configuração a ser utilizado
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environments[process.env.NODE_ENV] || '.env',
    }),

    // Define o módulo de log
    LoggerModule.forRootAsync({
      useFactory: (conf: ConfigService) => ({
        pinoHttp: {
          level: conf.get('LOG_LEVEL', 'info'),
          transport:
            conf.get('NODE_ENV', 'development') === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    levelFirst: true,
                    colorize: true,
                  },
                }
              : undefined,
          customProps: (req) => {
            return {
              requestId: req[REQUEST_ID_HEADER],
            };
          },
          autoLogging: false,
          serializers: {
            req: () => {
              return undefined;
            },
            res: () => {
              return undefined;
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    // Importa o módulo do Throttler
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 60 segundos
        limit: 10, // 10 requisições
      },
      {
        ttl: 60,
        limit: 5,
        ignoreUserAgents: [/googlebot/],
      },
    ]),
    // Define o Cache
    CacheModule.register(),
    DatabaseModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    EventModule,
    AuthModule,
    JstjModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FitroDeExcecaoHttp,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
