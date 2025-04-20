import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './role.controller';
import RoleRepository from './repositories/role.repository';
import { PermissionModule } from '../permission/permission.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  providers: [RoleService, RoleRepository],
  controllers: [RoleController],
  exports: [RoleRepository, RoleService],
  imports: [PermissionModule, JwtModule]
})
export class RoleModule {}
