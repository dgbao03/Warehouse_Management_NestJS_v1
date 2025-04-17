import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';
import { Option } from './entities/option.entity';
import { OptionValue } from './entities/option-values.entity';
import { ProductSku } from './entities/product-sku.entity';
import { SkuValue } from './entities/sku-value.entity';
import { OptionRepository, OptionValueRepository, ProductRepository, ProductSkuRepository, SkuValueRepository } from './repositories';
import { JwtModule } from '../jwt/jwt.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';


@Module({
  providers: [
    ProductService,
    ProductRepository,
    OptionRepository,
    OptionValueRepository,
    ProductSkuRepository,
    SkuValueRepository
  ],
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([User, Product, Option, OptionValue, ProductSku, SkuValue]), JwtModule, RoleModule, PermissionModule]
})
export class ProductModule {}
