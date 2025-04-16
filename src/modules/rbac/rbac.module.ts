import { Module } from '@nestjs/common';
import { RbacService } from './services/rbac.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { PermissionModule } from '../permission/permission.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  providers: [RbacService],
  exports: [RbacService],
  imports: [TypeOrmModule.forFeature([User, Permission, Role]), PermissionModule, RoleModule]
})
export class RbacModule {}
