import { Module } from '@nestjs/common';
import { RolePermissionController } from './role_permission.controller';
import { RolePermissionService } from './services/role_permission.service';

@Module({
  controllers: [RolePermissionController],
  providers: [RolePermissionService]
})
export class RolePermissionModule {}
