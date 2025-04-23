import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product, Option, ProductSku, SkuValue, OptionValue } from '../entities';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { BaseSkuDTO, CreateOptionValueDTO, CreateProductDTO, UpdateProductDTO, UpdateSkuDTO } from '../dtos';
import { ProductRepository, OptionRepository, OptionValueRepository, ProductSkuRepository } from '../repositories';
import { DataSource, EntityManager, In } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,

        private optionRepository: OptionRepository,

        private optionValueRepository: OptionValueRepository,

        private productSkuRepository: ProductSkuRepository,

        private dataSource: DataSource
    ){}

    // GET METHODs //
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
        const productSkuQueryBuilder = this.productSkuRepository.createQueryBuilder('productSku');

        if (query) productSkuQueryBuilder.where('LOWER(productSku.code) LIKE :query', { query: `%${query.toLowerCase()}%` });
        
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

    async getSkuById(id: number) {
        const sku = await this.productSkuRepository.findOne({ where: { id }, relations: ['skuValues', 'skuValues.option', 'skuValues.optionValue'] })

        if (!sku) throw new NotFoundException("Product-Code not found! Please try again!");

        return sku;
    }

    async getProductOptions(id: string) {
        const product = await this.productRepository.findOneBy({ id: id });
        if (!product) throw new BadRequestException(`Product ID not exists! Please try again!`);

        return await this.productRepository.findOne({ where: { id }, relations: ['options'] }); 
    }

    async getProductOptionValues(productId: string, optionId: number) {
        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) throw new BadRequestException(`Product ID not exists! Please try again!`);

        const option = await this.optionRepository.findOne({ where: { id: optionId, product: { id: productId } }, relations: ['values'] });

        if (!option) throw new NotFoundException(`Option with ID ${optionId} not found for product ${product.name}`);

        return option.values;
    }

    // POST METHODs //
    async createProduct(createData: CreateProductDTO) {
        const existedProduct = await this.productRepository.findOneBy({ name: createData.product_name });
        if (existedProduct) throw new BadRequestException("Product already exists! Please try again!");

        return await this.dataSource.transaction(async (entityManager) => {
            const productRepo = entityManager.getRepository(Product);
            const optionRepo = entityManager.getRepository(Option);
            const optionValueRepo = entityManager.getRepository(OptionValue);

            const { product_name, options } = createData;

            const newProduct = this.productRepository.create({ name: product_name });
            await productRepo.save(newProduct);
    
            for (const option of options) {
                const { option_name, values } = option;
                const newOption = optionRepo.create({ name: option_name, product: newProduct });
                await optionRepo.save(newOption);
    
                for (const value of values) {
                    const { value_name } = value;
                    const newOptionValue = optionValueRepo.create({ name: value_name, option: newOption });
                    await optionValueRepo.save(newOptionValue);
                }
            }

            return productRepo.findOne({
                where: { id: newProduct.id },
                relations: ["options", "options.values"]
            });
        })
    }

    async createSku(productId: string, createData: BaseSkuDTO) {
        return this.dataSource.transaction(async (entityManager) => {
            const productRepo = entityManager.getRepository(Product);
            const productSkuRepo = entityManager.getRepository(ProductSku);
            const skuValueRepo = entityManager.getRepository(SkuValue);

            const { skus } = createData;
            const product = await productRepo.findOneBy({ id: productId }) as Product;
            if (!product) throw new NotFoundException("Product not found! Please try again!");

            for (const sku of skus) {
                const existedSku = await productSkuRepo.findOneBy({ code: sku.code });
                if (existedSku) throw new BadRequestException(`Code: ${sku.code} already existed! Please try again!`);

                const { skuValues } = sku
                const newProductSku = productSkuRepo.create({
                    product: product,
                    code: sku.code,
                    price: sku.price,
                    stock: sku.stock
                });

                await productSkuRepo.save(newProductSku);

                for (const value of skuValues) {
                    const newSkuValue = skuValueRepo.create({
                        skuId: newProductSku.id,
                        optionId: value.option_id,
                        valueId: value.value_id,
                        option: { id: value.option_id},
                        optionValue: { id: value.value_id}  
                    });

                    await skuValueRepo.save(newSkuValue);
                }
            }
        })
    }

    async createOptionValue(optionId: number, createData: CreateOptionValueDTO) {
        const option = await this.optionRepository.findOneBy({ id: optionId }) as Option;

        if (!option) throw new NotFoundException("Option not found! Please try again!");

        for (const value of createData.values) {
            const newValue = this.optionValueRepository.create({ option: option, name: value.value_name });
            await this.optionValueRepository.save(newValue);
        }
    }

    // PUT METHODs //
    async updateProduct(id: string, updateData: UpdateProductDTO) {
        if (updateData.name){
            const existedProduct = await this.productRepository.findOneBy({ name: updateData.name });
            if (existedProduct) throw new BadRequestException("Product already exists! Please try again!");
        }

        return await this.productRepository.update(id, updateData);
    }

    async updateProductSku(id: number, updateData: UpdateSkuDTO) {
        if (updateData.code){
            const existedSku = await this.productSkuRepository.findOneBy({ code: updateData.code });
                if (existedSku) throw new BadRequestException(`Code: ${updateData.code} already existed! Please try again!`);
        }

        return await this.dataSource.transaction(async (entityManager) => {
            const productSkuRepo = entityManager.getRepository(ProductSku);
            const skuValueRepo = entityManager.getRepository(SkuValue);

            const productSku = await productSkuRepo.findOne({ where: { id }});

            if (!productSku) throw new NotFoundException("Product-Sku not found! Please try again!");

            await productSkuRepo.update(id, {
                code: updateData.code,
                stock: updateData.stock,
                price: updateData.price
            });

            if (updateData.values) {
                for (const skuValueUpdate of updateData.values) {
                    const skuValue = await skuValueRepo.findOneBy({ skuId: skuValueUpdate.skuId, optionId: skuValueUpdate.optionId })
                    if (skuValue) await skuValueRepo.update( { skuId: skuValueUpdate.skuId, optionId: skuValueUpdate.optionId }, { valueId: skuValueUpdate.valueId });
                }
            }

            return await productSkuRepo.findOne({ where: { id }, relations: ['skuValues', 'skuValues.option', 'skuValues.optionValue'] });
        })
    }

    // DELETE METHODs //
    async deleteProduct(id: string) {
        return await this.dataSource.transaction(async (entityManager) => {
            const productRepo = entityManager.getRepository(Product);
            const optionRepo = entityManager.getRepository(Option);
            const optionValueRepo = entityManager.getRepository(OptionValue);
            const productSkuRepo = entityManager.getRepository(ProductSku);
            const skuValueRepo = entityManager.getRepository(SkuValue);

            const options = await optionRepo.find({ where: { product: { id } } });
            const optionIds = options.map(option => option.id);
            if (optionIds.length > 0) await optionValueRepo.softDelete({ option: { id: In(optionIds) } });
                
            const productSkus = await productSkuRepo.find({ where: { product: { id } } });
            const skuIds = productSkus.map(sku => sku.id);
            if (skuIds.length > 0) await skuValueRepo.softDelete({ productSku: { id: In(skuIds) } });
        
            await productSkuRepo.softDelete({ product: { id } });
            await optionRepo.softDelete({ product: { id } });
            await productRepo.softDelete(id);
        })
    }

    async deleteSku(id: number) {
        return await this.dataSource.transaction(async (entityManager) => {
            const productSkuRepo = entityManager.getRepository(ProductSku);
            const skuValueRepo = entityManager.getRepository(SkuValue);

            await skuValueRepo.softDelete({ productSku: { id: id } });
            await productSkuRepo.softDelete(id);
        })
    }
}
