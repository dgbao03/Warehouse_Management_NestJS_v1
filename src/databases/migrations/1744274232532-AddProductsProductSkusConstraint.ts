import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductsProductSkusConstraint1744274232532 implements MigrationInterface {
    name = 'AddProductsProductSkusConstraint1744274232532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "FK_a680060e1187f37b1de35b15a9c" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "FK_a680060e1187f37b1de35b15a9c"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP COLUMN "productId"`);
    }

}
