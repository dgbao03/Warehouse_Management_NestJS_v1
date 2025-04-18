import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeExportQuantityColumnName1744877272148 implements MigrationInterface {
    name = 'ChangeExportQuantityColumnName1744877272148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stock_details" RENAME COLUMN "quantity" TO "export_quantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stock_details" RENAME COLUMN "export_quantity" TO "quantity"`);
    }

}
