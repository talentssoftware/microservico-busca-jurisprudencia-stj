import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@/commonServices/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserRepository,
    private jwtService: JwtService,
    private hash: HashService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.getUser({ email });
      // console.log(user);
      if (user && (await this.hash.comparePassword(user.password, pass))) {
        return user;
      }

      return null;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Email ou senha incorretos',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(user: any) {
    const payload = {
      username: user.name,
      sub: user.id,
      role: user.role?.name,
    };
    return await this.jwtService.signAsync(payload);
  }
}
