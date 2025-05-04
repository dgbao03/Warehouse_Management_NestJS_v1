import { BadRequestException, ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
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
            relations: ['options', 'options.values', 'productSkus', 'productSkus.skuValues', 'productSkus.skuValues.option', 'productSkus.skuValues.optionValue']
        })

        if (!product) throw new NotFoundException("Product not found! Please try again!");

        return product;
    }

    async getAllSkus(options: IPaginationOptions, query?: string): Promise<Pagination<ProductSku>> {
        const productSkuQueryBuilder = this.productSkuRepository.createQueryBuilder('productSku');

        if (query) productSkuQueryBuilder.where('LOWER(productSku.code) LIKE :query', { query: `%${query.toLowerCase()}%` });
        
        const paginatedSkus = await paginate<ProductSku>(productSkuQueryBuilder, options);

        const skuIds = paginatedSkus.items.map(sku => sku.id);

        const skusWithRelatedData = await this.productSkuRepository
            .createQueryBuilder('productSku')
            .leftJoinAndSelect('productSku.skuValues', 'skuValue')
            .leftJoinAndSelect('skuValue.option', 'option')
            .leftJoinAndSelect('skuValue.optionValue', 'optionValue')
            .where('productSku.id IN (:...ids)', { ids: skuIds })
            .getMany();

        return { ...paginatedSkus, items: skusWithRelatedData };
    }

    async getSkuById(id: number) {
        const sku = await this.productSkuRepository.findOne({ where: { id }, relations: ['skuValues', 'skuValues.option', 'skuValues.optionValue'] })

        if (!sku) throw new NotFoundException("Product not found! Please try again!");

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
        return await this.dataSource.transaction(async (entityManager) => {
            const productRepo = entityManager.getRepository(Product);
            const optionRepo = entityManager.getRepository(Option);
            const optionValueRepo = entityManager.getRepository(OptionValue);

            const { productName, options } = createData;

            const newProduct = this.productRepository.create({ name: productName });
            await productRepo.save(newProduct);
    
            for (const option of options) {
                const existedOption = await optionRepo.findOneBy({ name: option.optionName, product: { id: newProduct.id } });
                if (existedOption) throw new BadRequestException(`Duplicate Option ${option.optionName} for Product ${newProduct.name}! Please try again!`);

                const { optionName, values } = option;
                const newOption = optionRepo.create({ name: optionName, product: newProduct });
                await optionRepo.save(newOption);
    
                for (const value of values) {
                    const { valueName } = value;
                    const existedValue = await optionValueRepo.findOneBy({ name: valueName, option: { id: newOption.id} });
                    if (existedValue) throw new BadRequestException(`Duplicate Value ${valueName} for Option ${newOption.name}! Please try again!`);
                    
                    const newOptionValue = optionValueRepo.create({ name: valueName, option: newOption });
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
            const optionRepo = entityManager.getRepository(Option);
            const optionValueRepo = entityManager.getRepository(OptionValue);

            const { skus } = createData;
            const product = await productRepo.findOneBy({ id: productId }) as Product;
            if (!product) throw new NotFoundException("Product not found! Please try again!");

            const createdSkus: ProductSku[] = [];

            for (const sku of skus) {
                const existedSku = await productSkuRepo.findOneBy({ code: sku.code });
                if (existedSku) throw new BadRequestException(`Code: ${sku.code} already existed! Please try again!`);

                const { skuValues } = sku

                // Get all skus of the product
                const existingSkus = await productSkuRepo
                    .createQueryBuilder('sku')
                    .innerJoinAndSelect('sku.skuValues', 'skuValue')
                    .where('sku.product = :productId', { productId })
                    .getMany();

                // Sorted string of new sku's option-value pairs
                const newSkuOptionValues = skuValues
                    .map(sv => `${sv.optionId}-${sv.valueId}`)
                    .sort()
                    .join(',');

                // Compare with each sku's option-value of the product with the new sku's option-value
                for (const existingSku of existingSkus) {
                    const existingOptionValues = existingSku.skuValues
                        .map(sv => `${sv.optionId}-${sv.valueId}`)
                        .sort()
                        .join(',');

                    if (existingOptionValues === newSkuOptionValues) {
                        throw new BadRequestException(
                            `A SKU with these option values already exists (SKU Code: ${existingSku.code})`
                        );
                    }
                }

                const newProductSku = productSkuRepo.create({
                    product: product,
                    code: sku.code,
                    price: sku.price,
                    stock: sku.stock
                });

                await productSkuRepo.save(newProductSku);

                for (const value of skuValues) {
                    const option = await optionRepo.findOneBy({ id: value.optionId, product: { id: productId } });
                    if (!option) throw new BadRequestException(`Option with ID ${value.optionId} not belongs to product ${product.name}`);

                    const optionValue = await optionValueRepo.findOneBy({ id: value.valueId, option: { id: value.optionId} });
                    if (!optionValue) throw new BadRequestException(`Option value with ID ${value.valueId} not belongs to option ${option.name}`);

                    const newSkuValue = skuValueRepo.create({
                        skuId: newProductSku.id,
                        optionId: value.optionId,
                        valueId: value.valueId,
                        option: { id: value.optionId},
                        optionValue: { id: value.valueId}  
                    });

                    await skuValueRepo.save(newSkuValue);
                }

                const createdSku = await productSkuRepo.findOne({ where: { id: newProductSku.id }, relations: ['skuValues', 'skuValues.option', 'skuValues.optionValue'] }) as ProductSku;
                createdSkus.push(createdSku);
            }

            return createdSkus;
        })
    }

    async createOptionValue(productId: string, optionId: number, createData: CreateOptionValueDTO) {
        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) throw new NotFoundException("Product not found! Please try again!");

        const option = await this.optionRepository.findOneBy({ id: optionId }) as Option;
        if (!option) throw new NotFoundException("Option not found! Please try again!");

        const productOption = await this.optionRepository.findOneBy({ id: optionId, product: { id: productId }});
        if (!productOption) throw new NotFoundException(`Option ${option.name} (ID: ${option.id}) not belongs to Product ${product.name} (ID: ${product.id})`);

        for (const value of createData.values) {
            const existedOptionValue = await this.optionValueRepository.findOneBy({ name: value.valueName, option: { id: optionId } });
            if (existedOptionValue) throw new BadRequestException(`Option value with name ${value.valueName} already exists! Please try again!`);

            const newValue = this.optionValueRepository.create({ option: option, name: value.valueName });
            await this.optionValueRepository.save(newValue);
        }

        return await this.optionRepository.findOne({ where: { id: optionId }, relations: ['values'] });
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
        return await this.dataSource.transaction(async (entityManager) => {
            const productSkuRepo = entityManager.getRepository(ProductSku);
            const skuValueRepo = entityManager.getRepository(SkuValue);

            const productSku = await productSkuRepo.findOne({ where: { id: id }, relations: ['exportStockDetails', 'product', 'skuValues'] });
            if (productSku) {
                if (productSku.exportStockDetails.length > 0) throw new BadRequestException(`This Variant has been exported! Cannot update information!`);
            } else {
                throw new NotFoundException("Product-Variant not found! Please try again!");
            }
    
            if (updateData.code) {
                const existedSkuCode = await productSkuRepo.findOneBy({ code: updateData.code });
                if (existedSkuCode) throw new BadRequestException(`Code: ${updateData.code} already existed! Please try again!`);
            }

            await productSkuRepo.update(id, {
                code: updateData.code,
                stock: updateData.stock,
                price: updateData.price
            });

            if (updateData.values) {
                for (const skuValueUpdate of updateData.values) {
                    const option = await this.optionRepository.findOneBy({ id: skuValueUpdate.optionId, product: { id: productSku.product.id } });
                    if (!option) throw new BadRequestException(`Option with ID ${skuValueUpdate.optionId} not belongs to product ${productSku.product.name}`);

                    const optionValue = await this.optionValueRepository.findOneBy({ id: skuValueUpdate.valueId, option: { id: skuValueUpdate.optionId } });
                    if (!optionValue) throw new BadRequestException(`Option value with ID ${skuValueUpdate.valueId} not belongs to option ${option.name} (ID: ${option.id})`);

                    await skuValueRepo.update( { skuId: id, optionId: skuValueUpdate.optionId }, { valueId: skuValueUpdate.valueId });
                }
            }

            const updateProductSku = await productSkuRepo.findOne({ where: { id: id }, relations: ['skuValues'] });
            
            // Check if the updated sku is already existed in the product
            const existingSkus = await productSkuRepo
                .createQueryBuilder('sku')
                .innerJoinAndSelect('sku.skuValues', 'skuValue')
                .where('sku.product = :productId AND sku.id != :skuId', {
                    productId: productSku.product.id,
                    skuId: id
                }).getMany();

            const updateSkuOptionValues = updateProductSku?.skuValues.map(
                sv => `${sv.optionId}-${sv.valueId}`
            ).sort().join(',');

            for (const existingSku of existingSkus) {
                const existingOptionValues = existingSku.skuValues.map(
                    sv => `${sv.optionId}-${sv.valueId}`
                ).sort().join(',');
                
                if (existingOptionValues === updateSkuOptionValues) {
                    throw new BadRequestException(`A SKU with these option values already exists (SKU Code: ${existingSku.code})`);
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

            const productSkus = await productSkuRepo.find({ where: { product: { id } }, relations: ['exportStockDetails'] });
            if (productSkus.some(sku => sku.exportStockDetails.length > 0)) throw new BadRequestException(`This Product has been exported! Cannot delete information!`);

            const options = await optionRepo.find({ where: { product: { id } } });
            const optionIds = options.map(option => option.id);
            if (optionIds.length > 0) await optionValueRepo.softDelete({ option: { id: In(optionIds) } });
                
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

            const productSku = await productSkuRepo.findOne({ where: { id: id }, relations: ['exportStockDetails'] });
            if (productSku) {
                if (productSku.exportStockDetails.length > 0) throw new BadRequestException(`This Product has been exported! Cannot delete information!`);
            } else {
                throw new NotFoundException("Product not found! Please try again!");
            }

            await skuValueRepo.softDelete({ productSku: { id: id } });
            await productSkuRepo.softDelete(id);
        })
    }
}
