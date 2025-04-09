import { ExecutionContext, SetMetadata, UseGuards, applyDecorators, createParamDecorator } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionGuard } from 'src/guards/permission.guard';

export const Decorators = (...args: string[]) => SetMetadata('decorators', args);

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (permissions: string) => SetMetadata(PERMISSIONS_KEY, permissions);

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      
      return data ? request.user[data] : request.user;
    },
  );

export function Auth(permission: string) {
    return applyDecorators(
        Permissions(permission),
        UseGuards(AuthGuard, PermissionGuard)
    )
}
