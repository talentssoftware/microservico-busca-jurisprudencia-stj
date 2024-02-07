import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    // return user.role == role;
    return this.verifyRoles(roles, user.role);
  }
  verifyRoles(roles: string[], userRole: string): boolean {
    // if (userRole === undefined) return true;
    return roles.includes(userRole);
  }
}

export function Roles(...roles: string[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard));
}
export enum Role {
  MASTER = 'master',
  USER = 'user',
  VIEWER = 'viewer',
  PUBLIC = 'public',
}
