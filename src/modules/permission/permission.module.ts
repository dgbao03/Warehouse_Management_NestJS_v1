import { Module } from '@nestjs/common';
import PermissionRepository from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './permission.controller';

@Module({
    providers: [PermissionRepository, PermissionService],
    controllers: [PermissionController],
    exports: [PermissionRepository]
})
export class PermissionModule {}
