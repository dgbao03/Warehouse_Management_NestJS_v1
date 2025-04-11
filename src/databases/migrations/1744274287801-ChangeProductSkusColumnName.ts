import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProductSkusColumnName1744274287801 implements MigrationInterface {
    name = 'ChangeProductSkusColumnName1744274287801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "FK_a680060e1187f37b1de35b15a9c"`);
        await queryRunner.query(`ALTER TABLE "product_skus" RENAME COLUMN "productId" TO "product_id"`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "FK_e684b596b9ec2474335e7695267" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "FK_e684b596b9ec2474335e7695267"`);
        await queryRunner.query(`ALTER TABLE "product_skus" RENAME COLUMN "product_id" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "FK_a680060e1187f37b1de35b15a9c" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
