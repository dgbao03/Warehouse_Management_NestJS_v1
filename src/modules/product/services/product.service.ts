import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from '../entities/option.entity';
import { OptionValue } from '../entities/option-values.entity';
import { ProductSku } from '../entities/product-sku.entity';
import { SkuValue } from '../entities/sku-value.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(Option)
        private optionRepository: Repository<Option>,

        @InjectRepository(OptionValue)
        private optionValueRepository: Repository<OptionValue>,

        @InjectRepository(ProductSku)
        private productSkuRepository: Repository<ProductSku>,

        @InjectRepository(SkuValue)
        private skuValueRepository: Repository<SkuValue>
    ){}

    async getAllProducts(options: IPaginationOptions, query?: string): Promise<Pagination<Product>> {
        const queryBuilder = this.productRepository.createQueryBuilder('product');

        if (query) queryBuilder.where('LOWER(product.name) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Product>(queryBuilder, options);
    }

    async getProductById(id: string) {
        const product =  await this.productRepository.findOne({
            where: { id },
            relations: [
                'productSkus',
                'productSkus.skuValues', 
                'productSkus.skuValues.option', 
                'productSkus.skuValues.optionValue'
            ]
        })

        if (!product) throw new NotFoundException("Product not found! Please try again!");

        return Product.instanceToPlain(product);
    }

    async getAllSkus(options: IPaginationOptions, query?: string): Promise<Pagination<ProductSku>> {
        const queryBuilder = this.productSkuRepository
            .createQueryBuilder('productSku')
            .distinctOn(['productSku.id'])
            .leftJoinAndSelect('productSku.skuValues', 'skuValue')
            .leftJoinAndSelect('skuValue.option', 'option')
            .leftJoinAndSelect('skuValue.optionValue', 'optionValue');

        if (query) queryBuilder.where('LOWER(productSku.code) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<ProductSku>(queryBuilder, options,);
    }

    async getSkuByCode(code: string) {
        const sku = await this.productSkuRepository.findOne({
            where: { code },
            relations: [
                'skuValues',
                'skuValues.option',
                'skuValues.optionValue'
            ]
        })

        if (!sku) throw new NotFoundException("Product Code not found! Please try again!");

        return ProductSku.instanceToPlain(sku);
    }

    async getProductOptions(id: string) {
        return Product.instanceToPlain(await this.productRepository.findOne({
            where: { id },
            relations: ['options']
        })) 
    }

    async getProductOptionValues(productId: string, optionId: number) {
        const option = await this.optionRepository.findOne({
            where: { id: optionId, product: { id: productId } },
            relations: ['values'], 
        });

        if (!option) {
            throw new NotFoundException(`Option with ID ${optionId} not found for product ${productId}`);
        }

        return option.values;
    }

}
