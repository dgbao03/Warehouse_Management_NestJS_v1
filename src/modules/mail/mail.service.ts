import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import RoleRepository from '../role/repositories/role.repository';
import UserRepository from '../user/repositories/user.repository';
import { ExportStock } from '../export_stock/entities/export.entity';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,

        private userRepository: UserRepository
    ) {}

    async sendExportEmail(exportStock: ExportStock) {
        try {
            const admins = await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.roles', 'role')
                .where('role.name = :roleName', { roleName: 'Admin' })
                .select(['user.email'])
                .getMany();

            const adminEmails = admins.map(admin => admin.email);

            await this.mailerService.sendMail({
                to: adminEmails,
                subject: 'Export Report',
                template: './templates/export_stock.template.hbs', 
                context: {
                    exportStockData: exportStock,
                    user: exportStock.user?.fullname
                },
                });
        } catch (error) {
            throw error;
        }
    }
}
