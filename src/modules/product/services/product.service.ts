import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from '../entities/option.entity';
import { OptionValue } from '../entities/option-values.entity';
import { ProductSku } from '../entities/product-sku.entity';
import { SkuValue } from '../entities/sku-value.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { BaseSkuDTO, CreateOptionValueDTO, CreateProductDTO, UpdateProductDTO } from '../dtos';
import { UpdateSkuDTO } from '../dtos';

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

    // GET METHOD //
    async getAllProducts(options: IPaginationOptions, query?: string): Promise<Pagination<Product>> {
        const queryBuilder = this.productRepository.createQueryBuilder('product');

        if (query) queryBuilder.where('LOWER(product.name) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<Product>(queryBuilder, options);
    }

    async getProductById(id: string) {
        const product =  await this.productRepository.findOne({
            where: { id },
            relations: ['productSkus', 'productSkus.skuValues', 'productSkus.skuValues.option', 'productSkus.skuValues.optionValue']
        })

        if (!product) throw new NotFoundException("Product not found! Please try again!");

        return Product.instanceToPlain(product);
    }

    async getAllSkus(options: IPaginationOptions, query?: string): Promise<Pagination<ProductSku>> {
        const productSkuQueryBuilder = this.productSkuRepository
            .createQueryBuilder('productSku');

        if (query) {
            productSkuQueryBuilder.where('LOWER(productSku.code) LIKE :query', { query: `%${query.toLowerCase()}%` });
        }

        const paginatedSkus = await paginate<ProductSku>(productSkuQueryBuilder, options);

        const skuIds = paginatedSkus.items.map(sku => sku.id);

        if (skuIds.length > 0) {
            const skusWithRelatedData = await this.productSkuRepository
                .createQueryBuilder('productSku')
                .leftJoinAndSelect('productSku.skuValues', 'skuValue')
                .leftJoinAndSelect('skuValue.option', 'option')
                .leftJoinAndSelect('skuValue.optionValue', 'optionValue')
                .where('productSku.id IN (:...ids)', { ids: skuIds })
                .getMany();

            const skuValueMap = new Map<number, ProductSku>();
            skusWithRelatedData.forEach(sku => {
                skuValueMap.set(sku.id, sku);
            });

            const itemsWithValues = paginatedSkus.items.map(sku => {
                return skuValueMap.get(sku.id) || sku;
            });

            return { ...paginatedSkus, items: itemsWithValues };
        }

        return paginatedSkus;
    }

    async getSkuByCode(id: number) {
        const sku = await this.productSkuRepository.findOne({
            where: { id },
            relations: ['skuValues', 'skuValues.option', 'skuValues.optionValue']
        })

        if (!sku) throw new NotFoundException("Product-Code not found! Please try again!");

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

    // POST METHOD //
    async createProduct(createData: CreateProductDTO) {
        const { product_name, options } = createData;

        const newProduct = this.productRepository.create({ name: product_name });
        await this.productRepository.save(newProduct);

        for (const option of options) {
            const { option_name, values } = option;
            const newOption = this.optionRepository.create({ name: option_name, product: newProduct });
            await this.optionRepository.save(newOption);

            for (const value of values) {
                const { value_name } = value;
                const newOptionValue = this.optionValueRepository.create({ name: value_name, option: newOption });
                await this.optionValueRepository.save(newOptionValue);
            }
        }

        return this.productRepository.findOneBy({ id: newProduct.id });
    }

    async createSku(productId: string, createData: BaseSkuDTO) {
        const { skus } = createData;
        const product = await this.productRepository.findOneBy({ id: productId }) as Product;

        if (!product) throw new NotFoundException("Product not found! Please try again!");

        for (const sku of skus) {
            const { skuValues } = sku
            const newProductSku = this.productSkuRepository.create({
                product: product,
                code: sku.code,
                price: sku.price,
                stock: sku.stock
            });

            await this.productSkuRepository.save(newProductSku);

            for (const value of skuValues) {
                const newSkuValue = this.skuValueRepository.create({
                    skuId: newProductSku.id,
                    optionId: value.option_id,
                    valueId: value.value_id,
                    option: { id: value.option_id},
                    optionValue: { id: value.value_id}  
                });

                await this.skuValueRepository.save(newSkuValue);
            }
        }
    }

    async createOptionValue(optionId: number, createData: CreateOptionValueDTO) {
        const option = await this.optionRepository.findOneBy({ id: optionId }) as Option;

        if (!option) throw new NotFoundException("Option not found! Please try again!");

        for (const value of createData.values) {
            const newValue = this.optionValueRepository.create({
                option: option,
                name: value.value_name
            })

            await this.optionValueRepository.save(newValue);
        }
    }

    // PUT METHOD //
    async updateProduct(id: string, updateData: UpdateProductDTO) {
        return await this.productRepository.update(id, updateData);
    }

    async updateProductSku(id: number, updateData: UpdateSkuDTO) {
        const productSku = await this.productSkuRepository.findOne({ where: { id }});

        if (!productSku) throw new NotFoundException("Product-Sku not found! Please try again!");

        await this.productSkuRepository.update(id, {
            code: updateData.code,
            stock: updateData.stock,
            price: updateData.price
        });

        if (updateData.values) {
            for (const skuValueUpdate of updateData.values) {
                const skuValue = await this.skuValueRepository.findOneBy({
                    skuId: skuValueUpdate.skuId,
                    optionId: skuValueUpdate.optionId
                })

                if (skuValue) await this.skuValueRepository.update(
                    {
                        skuId: skuValueUpdate.skuId,
                        optionId: skuValueUpdate.optionId
                    },
                    { valueId: skuValueUpdate.valueId }
                )
            }
        }

        return await this.productSkuRepository.findOne({
            where: { id },
            relations: ['skuValues', 'skuValues.option', 'skuValues.optionValue']
        });
    }

    // DELETE METHOD // 
    async deleteProduct(id: string) {
        const options = await this.optionRepository.findBy({ product: { id: id }});
        for (const option of options) {
            const optionValues = await this.optionValueRepository.findBy({ option: { id: option.id} });
            for (const optionValue of optionValues) {
                await  this.optionValueRepository.softDelete(optionValue.id);
            }

            await this.optionRepository.softDelete(option.id);
        }

        const productSkus = await this.productSkuRepository.findBy({ product: { id: id }});
        for (const productSku of productSkus) {
            const skuValues = await this.skuValueRepository.findBy({ productSku: { id: productSku.id} });
            for (const skuValue of skuValues) {
                await this.skuValueRepository.softDelete({ skuId: skuValue.skuId, optionId: skuValue.optionId });
            }

            await this.productSkuRepository.softDelete(productSku.id);
        } 

        await this.productRepository.softDelete(id);
    }

    async deleteSku(id: number) {
        const skuValues = await this.skuValueRepository.findBy({ productSku: { id: id} });

        for (const skuValue of skuValues) {
            await this.skuValueRepository.softDelete({ skuId: skuValue.skuId, optionId: skuValue.optionId });
        }

        await this.productSkuRepository.softDelete(id);
    }


}
