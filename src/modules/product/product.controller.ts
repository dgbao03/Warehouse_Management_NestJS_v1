import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';
import { ProductSku } from './entities/product-sku.entity';

@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ){}

    @Get()
    async getAllProducts(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Product>> {
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/products', 
        };

        return this.productService.getAllProducts(options, query); 
    }

    @Get("skus")
    getAllSkus(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5
    ): Promise<Pagination<ProductSku>> {
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/products/skus', 
        };

        return this.productService.getAllSkus(options, query); 
    }

    @Get(":id")
    getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }

    @Get("skus/:code")
    getSkuByCode(@Param('code') code: string) {
        return this.productService.getSkuByCode(code);
    }

    @Get(':id/options')
    getProductOptions(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productService.getProductOptions(id);
    }

    @Get(':productId/options/:optionId/values')
    getProductOptionValues(@Param('productId') productId: string, @Param('optionId') optionId: number) {
        return this.productService.getProductOptionValues(productId, optionId);
    }


}
