import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { add } from 'date-fns';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private conf: ConfigService) {}

  @SkipThrottle()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async verify(@Request() req) {
    return req?.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.cookie('token', '', { expires: new Date() });
    return 'OK';
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Logado com sucesso',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
        token: { type: 'string' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user);
    res.cookie('token', token, {
      httpOnly: true,
      domain: this.conf.get('COOKIE_DOMAIN'),
    });

    const expireIn = this.expireIn(this.conf.get('JWT_EXPIRES_IN', '1h'));
    return {
      user: req?.user,
      token: token,
      expiresIn: expireIn,
    };
  }

  /**
   * Retorna o tempo de expiração
   * @param str
   * @private
   * @returns number
   */
  private expireIn(str: string): number {
    const unit = str.at(-1);
    const value = parseInt(str.slice(0, -1));
    if (unit === 'd') {
      return add(new Date(), { days: value }).getTime();
    } else if (unit === 's') {
      return add(new Date(), { seconds: value }).getTime();
    } else if (unit === 'm') {
      return add(new Date(), { minutes: value }).getTime();
    } else if (unit === 'h') {
      return add(new Date(), { hours: value }).getTime();
    } else if (unit === 'y') {
      return add(new Date(), { years: value }).getTime();
    } else if (unit === 'w') {
      return add(new Date(), { weeks: value }).getTime();
    } else {
      throw new Error('Unidade de tempo desconhecida.');
    }
  }
}
