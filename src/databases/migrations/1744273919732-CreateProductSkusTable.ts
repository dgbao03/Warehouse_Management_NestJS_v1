import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductSkusTable1744273919732 implements MigrationInterface {
    name = 'CreateProductSkusTable1744273919732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "UQ_a62a7f4dd9eb3f6473d277a48d8"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD "code" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "UQ_8b73bb4f9f6f5eb00a99e147ee5" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD "stockQuantity" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" DROP COLUMN "stockQuantity"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "UQ_8b73bb4f9f6f5eb00a99e147ee5"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "UQ_a62a7f4dd9eb3f6473d277a48d8" UNIQUE ("name")`);
    }

}
