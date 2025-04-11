import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductOptionConstraint1744272453742 implements MigrationInterface {
    name = 'CreateProductOptionConstraint1744272453742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "options" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "options" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "options" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "option_values" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "option_values" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "option_values" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "UQ_0c60ab5e2117b9efe4b3d696891" UNIQUE ("productId", "id")`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_a01cf42414edc937976627e00d7" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_a01cf42414edc937976627e00d7"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "UQ_0c60ab5e2117b9efe4b3d696891"`);
        await queryRunner.query(`ALTER TABLE "option_values" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "option_values" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "option_values" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "options" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "options" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "options" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "options" DROP COLUMN "created_at"`);
    }

}
