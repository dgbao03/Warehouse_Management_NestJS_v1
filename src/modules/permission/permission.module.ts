import { Module } from '@nestjs/common';
import PermissionRepository from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './permission.controller';
import { JwtModule } from '../jwt/jwt.module';

@Module({
    providers: [PermissionRepository, PermissionService],
    controllers: [PermissionController],
    exports: [PermissionRepository, PermissionService],
    imports: [JwtModule]
})
export class PermissionModule {}
