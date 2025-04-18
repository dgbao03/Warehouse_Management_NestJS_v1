import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeExportPriceColumnName1744877036176 implements MigrationInterface {
    name = 'ChangeExportPriceColumnName1744877036176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stock_details" RENAME COLUMN "exportPrice" TO "export_price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stock_details" RENAME COLUMN "export_price" TO "exportPrice"`);
    }

}
