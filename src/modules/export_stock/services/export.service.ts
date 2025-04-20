import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ExportStockRepository } from '../repositories/export.repository';
import { CreateExportStockDTO, UpdateExportStockDTO } from '../dtos';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { ProductSku } from 'src/modules/product/entities';
import { ExportStock } from '../entities/export.entity';
import { ExportStockDetail } from '../entities/export-detail.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import UserRepository from 'src/modules/user/repositories/user.repository';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ExportService {
    constructor(
        private exportStockRepository: ExportStockRepository,

        private userRepository: UserRepository,

        private dataSource: DataSource,

        @InjectQueue('inventory_queue') private inventoryQueue: Queue
    ){}

    async getAllExports(options: IPaginationOptions, query?: string): Promise<Pagination<ExportStock>> {
        const queryBuilder = this.exportStockRepository.createQueryBuilder('export');

        if (query) queryBuilder.where('LOWER(export.id::text) LIKE :query', { query: `%${query}%` });

        return paginate<ExportStock>(queryBuilder, options);
    }

    async getExportById(id: string) {
        return await this.exportStockRepository.findOne({ where: { id: id }, relations: ['exportStockDetails', 'exportStockDetails.productSku'],
            select: { id: true, description: true, created_at: true, updated_at: true, status: true, reason: true,
                exportStockDetails: {
                    skuId: true,
                    exportStockId: true,
                    exportQuantity: true,
                    exportPrice: true,
                    productSku: {
                        code: true,
                        price: true
                    }
                }
            }
        })
    }

    async createExport(createData: CreateExportStockDTO){
        const currentUser = await this.userRepository.findOneBy({ id: createData.userId });
        if (!currentUser) throw new BadRequestException("User not found! Please try again!");

        const newExportStock = this.exportStockRepository.create({
            user: currentUser,
            description: createData.description
        })

        const savedExport = await this.exportStockRepository.save(newExportStock);

        await this.inventoryQueue.add(
            'create_export',
            {
                exportStockId: savedExport.id,
                exportStockDetails: createData.exportStockDetails

            }
        )

        return {
            export: savedExport,
            status: "Your request is under processing!"
        };
    }

    // No Use in Project
    async updateExport(id: string, updateData: UpdateExportStockDTO) {
        return this.dataSource.transaction(async (entityManager) => {
            const exportStockRepo = entityManager.getRepository(ExportStock);
            const userRepo = entityManager.getRepository(User);
            const productSkuRepo = entityManager.getRepository(ProductSku);
            const exportStockDetailRepo = entityManager.getRepository(ExportStockDetail);

            const currentUser = await userRepo.findOneBy({ id: updateData.userId });
            if (!currentUser) throw new BadRequestException("User not found! Please try again!");
            
            const exportStock = await exportStockRepo.findOne({
                where: { id: id },
                relations: ['exportStockDetails']
            });
            if (!exportStock) throw new NotFoundException(`Export with ID ${id} not found! Please try again!`);

            for (const exportStockDetail of exportStock.exportStockDetails) {
                const sku = await productSkuRepo.findOneBy({ id: exportStockDetail.skuId });
                if (sku){
                    sku.stock += exportStockDetail.exportQuantity; 
                    await productSkuRepo.save(sku);
                } 
            }

            await exportStockDetailRepo
                .createQueryBuilder('export_stock_details')
                .delete()
                .where('export_stock_details.export_stock_id = :id', { id })
                .execute();

            for (const exportStockDetail of updateData.exportStockDetails){
                const sku = await productSkuRepo.findOneBy({ id: exportStockDetail.skuId });
                if (!sku) throw new BadRequestException(`Product Sku with ID ${exportStockDetail.skuId} not found! Please try again!`);
    
                if(exportStockDetail.exportQuantity > sku.stock) throw new BadRequestException("Export quantity can bigger than current stock!");

                const newExportStockDetail = exportStockDetailRepo.create({
                    exportStock: exportStock,
                    productSku: sku,
                    exportQuantity: exportStockDetail.exportQuantity,
                    exportPrice: exportStockDetail.exportPrice
                })

                sku.stock -= exportStockDetail.exportQuantity;
                await productSkuRepo.save(sku);
    
                await exportStockDetailRepo.save(newExportStockDetail);
            }

            await exportStockRepo.update(id, {
                user: currentUser,
                description: updateData.description
            });
        });
    }
    
    // No Use in Project
    async deleteExport(id: string) {
        return this.dataSource.transaction(async (entityManager) => {
            const exportStockRepo = entityManager.getRepository(ExportStock);
            const productSkuRepo = entityManager.getRepository(ProductSku);
            const exportStockDetailRepo = entityManager.getRepository(ExportStockDetail);

            const exportStock = await exportStockRepo.findOne({
                where: { id: id },
                relations: ['exportStockDetails']
            });

            if (!exportStock) throw new NotFoundException(`Export with ID ${id} not found! Please try again!`);

            for (const exportStockDetail of exportStock.exportStockDetails) {
                const sku = await productSkuRepo.findOneBy({ id: exportStockDetail.skuId });
                if (sku){
                    sku.stock += exportStockDetail.exportQuantity; 
                    await productSkuRepo.save(sku);
                } 
            }

            await exportStockDetailRepo
                .createQueryBuilder('export_stock_details')
                .delete()
                .where('export_stock_details.export_stock_id = :id', { id })
                .execute();

            await exportStockRepo.delete(id);
        });
    }

}
