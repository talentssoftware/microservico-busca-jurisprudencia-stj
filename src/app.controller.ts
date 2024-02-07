import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class AppController {
  constructor(private config: ConfigService) {}

  @ApiResponse({ status: 200, description: 'Bem vindo' })
  @Get()
  async showHome() {
    return {
      message: 'Bem vindo ao sistema',
      version: this.config.get(
        'APP_VERSION',
        process?.env?.npm_package_version,
      ),
    };
  }
}
