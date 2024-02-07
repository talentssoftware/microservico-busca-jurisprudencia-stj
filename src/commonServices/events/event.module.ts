import { Module } from '@nestjs/common';
import { ErrorService } from './error.service';

@Module({
  providers: [
    // Importa o serviço de erro
    ErrorService,
  ],
})
export class EventModule {}
