import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Job } from "bullmq";
import { DataSource } from "typeorm";
import { ProductSku, SkuValue } from "../product/entities";
import { ExportStock } from "../export_stock/entities/export.entity";
import { ExportStockDetail } from "../export_stock/entities/export-detail.entity";
import { ExportStockDetailDTO } from "../export_stock/dtos";
import { ExportStockRepository } from "../export_stock/repositories/export.repository";
import { Status } from "src/utils/status.enum";
import { MailService } from "../mail/mail.service";

@Processor("inventory_queue")
@Injectable()
export class InventoryConsumer extends WorkerHost {
    constructor(
        private dataSource: DataSource,

        private exportStockRepository: ExportStockRepository,

        private mailService: MailService
    ){
        super();
    }

    async process(job: Job<any, any, string>, token?: string | undefined): Promise<any> {
        try {
            await this.dataSource.transaction(async (entityManager) => {
                const productSkuRepo = entityManager.getRepository(ProductSku);
                const exportStockDetailRepo = entityManager.getRepository(ExportStockDetail);
                const exportStockRepo = entityManager.getRepository(ExportStock);

                switch(job.name){
                    case "create_export": {
                        const { exportStockId, exportStockDetails } = job.data as { exportStockId: string, exportStockDetails: ExportStockDetailDTO[] }

                        const exportStock = await exportStockRepo.findOneBy({id: exportStockId}) as ExportStock;

                        for (const exportStockDetail of exportStockDetails) {
                            const sku = await productSkuRepo.findOneBy({ id: exportStockDetail.skuId });
                            if (!sku) throw new BadRequestException(`Product Sku with ID ${exportStockDetail.skuId} not found!`);
                
                            if (exportStockDetail.exportQuantity > sku.stock){
                                throw new BadRequestException(`Export quantity (${exportStockDetail.exportQuantity}) for ${sku.code} exceeds current stock (${sku.stock})`);
                            }
                
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

                        break;
                    }

                    default: throw new InternalServerErrorException("Server Error!");
                } 
            });

        } catch (error) {
            throw error;
        }
    }


    @OnWorkerEvent('completed')
    async onJobCompleted(job: Job) {
        try {
            const { exportStockId } = job.data;
            if (!exportStockId) return "No Export ID found!";

            const exportStock = await this.exportStockRepository.findOne({ 
                where: { id: exportStockId },
                relations: ['user', 'exportStockDetails', 'exportStockDetails.productSku']
            });
            if (exportStock){
                exportStock.status = Status.Completed;
                exportStock.reason = "Create Export Successful!";
                await this.exportStockRepository.save(exportStock);

                await this.mailService.sendExportEmail(exportStock);
            }
        } catch (error) {
            throw error;
        }
    }

    @OnWorkerEvent('failed')
    async onJobFailed(job: Job, error: Error) {
        try {
            const { exportStockId } = job.data;
            if (!exportStockId) return "No Export ID found!";

            const exportStock = await this.exportStockRepository.findOne({ 
                where: { id: exportStockId },
                relations: ['user']
            });

            if (exportStock){
                exportStock.status = Status.Failed;
                exportStock.reason = error.message;
                await this.exportStockRepository.save(exportStock);

                await this.mailService.sendExportEmail(exportStock);
            }
        } catch (error) {
            throw error;
        }
    }
}