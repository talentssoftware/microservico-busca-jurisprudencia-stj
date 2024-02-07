import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ErrorService {
  @OnEvent('error.critical.scheduling')
  handleCriticalSchedulingEvent(payload: Error) {
    // Send an email to the admin
    console.error('Critical scheduling error', payload);
  }
}
