import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductSkusColumnNameTable1744274025231 implements MigrationInterface {
    name = 'UpdateProductSkusColumnNameTable1744274025231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" RENAME COLUMN "stockQuantity" TO "stock"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" RENAME COLUMN "stock" TO "stockQuantity"`);
    }

}
