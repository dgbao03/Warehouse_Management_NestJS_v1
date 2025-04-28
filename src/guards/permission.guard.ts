import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { PermissionService } from '../modules/permission/services/permission.service';
import { RoleService } from '../modules/role/services/role.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(

    private reflector: Reflector,
    private permissionService: PermissionService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userRoles = request.user.roles;

    const allowRoles = await this.permissionService.getPermissionRoles(requiredPermissions);

    const hasPermission = userRoles.some(userRole =>
      allowRoles.includes(userRole),
    );

    return hasPermission;
  }
}
