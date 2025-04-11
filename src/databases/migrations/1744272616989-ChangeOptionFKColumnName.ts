import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOptionFKColumnName1744272616989 implements MigrationInterface {
    name = 'ChangeOptionFKColumnName1744272616989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_a01cf42414edc937976627e00d7"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "UQ_0c60ab5e2117b9efe4b3d696891"`);
        await queryRunner.query(`ALTER TABLE "options" RENAME COLUMN "productId" TO "product_id"`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "UQ_451caf7560009fc1ba24438f607" UNIQUE ("product_id", "id")`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_8f509b13eba74e88f50da0d1133" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_8f509b13eba74e88f50da0d1133"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "UQ_451caf7560009fc1ba24438f607"`);
        await queryRunner.query(`ALTER TABLE "options" RENAME COLUMN "product_id" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "UQ_0c60ab5e2117b9efe4b3d696891" UNIQUE ("id", "productId")`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_a01cf42414edc937976627e00d7" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
