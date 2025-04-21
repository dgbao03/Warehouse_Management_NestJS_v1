import { BullModule } from '@nestjs/bullmq';
import { Module, forwardRef } from '@nestjs/common';
import { InventoryConsumer } from './queue.consumer';
import { ExportModule } from '../export_stock/export.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'inventory_queue'
        }),
        forwardRef(() => ExportModule),

        MailModule
    ],

    providers: [InventoryConsumer],

    exports: [
        BullModule.registerQueue({ name: 'inventory_queue' }),
    ]
})
export class QueueModule {}
