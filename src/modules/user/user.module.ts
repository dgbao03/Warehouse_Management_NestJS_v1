import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '../jwt/jwt.module';
import UserRepository from './repositories/user.repository';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), AuthModule, JwtModule, RoleModule, PermissionModule],
  exports: [UserRepository]
})
export class UserModule {}
