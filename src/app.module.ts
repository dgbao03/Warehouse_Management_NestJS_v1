import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from "path";
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RbacModule } from './modules/rbac/rbac.module';
import typeorm from './databases/typeorm';


@Module({
  imports: [UserModule, JwtModule, AuthModule, ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, './configs/.env'),
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm') as TypeOrmModuleOptions)
    }),
    RbacModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
