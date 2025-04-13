import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './entities/product.entity';
import { ProductSku } from './entities/product-sku.entity';
import { BaseSkuDTO, CreateOptionValueDTO, CreateProductDTO, UpdateProductDTO } from './dtos';
import { UpdateSkuDTO } from './dtos';

@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ){}

    // GET METHOD //
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

    @Get("skus/:id")
    getSkuByCode(@Param('id') id: number) {
        return this.productService.getSkuByCode(id);
    }

    @Get(':id/options')
    getProductOptions(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.productService.getProductOptions(id);
    }

    @Get(':productId/options/:optionId/values')
    getProductOptionValues(@Param('productId') productId: string, @Param('optionId') optionId: number) {
        return this.productService.getProductOptionValues(productId, optionId);
    }

    // POST METHOD //
    @Post()
    @UsePipes(new ValidationPipe())
    createProduct(@Body() createData: CreateProductDTO) {
        return this.productService.createProduct(createData);
    }

    @Post(':id/skus')
    @UsePipes(new ValidationPipe())
    createSku(@Param('id') productId: string, @Body() createData: BaseSkuDTO) {
        return this.productService.createSku(productId, createData);
    }

    @Post(':productId/options/:optionId/values')
    @UsePipes(new ValidationPipe())
    createOptionValue(@Param('optionId') optionId: number, @Body() createData: CreateOptionValueDTO) {
        return this.productService.createOptionValue(optionId, createData);
    }

    // PUT METHOD //
    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateProduct(@Param('id') id: string, @Body() updateData: UpdateProductDTO) {
        return this.productService.updateProduct(id, updateData);
    }

    @Put('skus/:id')
    @UsePipes(new ValidationPipe())
    updateProductSku(@Param('id') id: number, @Body() updateData: UpdateSkuDTO) {
        return this.productService.updateProductSku(id, updateData);
    }

    // DELETE METHOD //
    @Delete(':id')
    deleteProduct(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }

    @Delete("/skus/:id")
    deleteSku(@Param('id') id: number) {
        return this.productService.deleteSku(id);
    }

}
