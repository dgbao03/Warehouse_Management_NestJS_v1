import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '../jwt/jwt.module';
import { RbacModule } from '../rbac/rbac.module';
import UserRepository from './repositories/user.repository';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), AuthModule, JwtModule, RbacModule],
  exports: [UserRepository]
})
export class UserModule {}
