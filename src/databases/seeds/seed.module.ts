import { Module } from '@nestjs/common';
import { SeedService } from './services/seed.service';
import { RoleModule } from '../../modules/role/role.module';
import { PermissionModule } from '../../modules/permission/permission.module';
import { UserModule } from '../../modules/user/user.module';
import { AuthModule } from '../../modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeorm from '../typeorm';
import * as path from "path";

@Module({
  providers: [SeedService],
  imports: [RoleModule, PermissionModule, UserModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../configs/.env'),
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm') as TypeOrmModuleOptions)
    }),
  ]
})
export class SeedModule {}
