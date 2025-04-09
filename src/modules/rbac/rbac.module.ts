import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';

@Module({
  providers: [RbacService],
  exports: [RbacService],
  imports: [TypeOrmModule.forFeature([User, Permission, Role])]
})
export class RbacModule {}
