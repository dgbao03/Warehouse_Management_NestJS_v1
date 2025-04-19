import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './services/export.service';
import { ExportStockRepository } from './repositories/export.repository';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { ExportStockDetailRepository } from './repositories/export-detail.repository';
import { QueueModule } from '../queue/queue.module';

@Module({
  controllers: [ExportController],
  providers: [ExportService, ExportStockRepository, ExportStockDetailRepository],
  imports: [
    UserModule, 
    ProductModule,
    QueueModule
  ],
  exports: [ExportStockRepository]
})
export class ExportModule {}
