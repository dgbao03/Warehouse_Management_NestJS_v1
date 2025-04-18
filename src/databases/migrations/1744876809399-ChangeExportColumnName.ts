import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeExportColumnName1744876809399 implements MigrationInterface {
    name = 'ChangeExportColumnName1744876809399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stock_details" RENAME COLUMN "price" TO "exportPrice"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stock_details" RENAME COLUMN "exportPrice" TO "price"`);
    }

}
