import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './role.controller';
import RoleRepository from './repositories/role.repository';

@Module({
  providers: [RoleService, RoleRepository],
  controllers: [RoleController],
  exports: [RoleRepository]
})
export class RoleModule {}
