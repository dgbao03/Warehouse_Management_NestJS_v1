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
import { MailModule } from './modules/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
    SeedModule,
    MailModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_SERVER_HOST'),
          port: configService.get<number>('MAIL_SERVER_PORT'),
          secure: configService.get<boolean>('MAIL_SERVER_SECURE'), 
          auth: {
            user: configService.get<string>('MAIL_SERVER_USER'),
            pass: configService.get<string>('MAIL_SERVER_PASSWORD'),
          },
        },
        tls: {
          rejectUnauthorized: false, 
        },
        defaults: {
          from: `${configService.get<string>('MAIL_SERVER_FROM')}`,
        },
        template: {
          dir: path.join(__dirname),
          adapter: new HandlebarsAdapter(), 
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
