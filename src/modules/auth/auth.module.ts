import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [JwtModule, TypeOrmModule.forFeature([User]), RbacModule],
  exports: [AuthService]
})
export class AuthModule {}
