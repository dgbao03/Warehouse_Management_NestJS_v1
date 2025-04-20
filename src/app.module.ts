import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from "path";
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ExportModule } from './modules/export_stock/export.module';
import typeorm from './databases/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from './modules/queue/queue.module';
import { SeedModule } from './databases/seeds/seed.module';

@Module({
  imports: [UserModule, JwtModule, ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, './configs/.env'),
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm') as TypeOrmModuleOptions)
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    RoleModule,
    PermissionModule,
    ExportModule,
    QueueModule,
    SeedModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
