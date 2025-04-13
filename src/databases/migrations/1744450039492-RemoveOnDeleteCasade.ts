import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOnDeleteCasade1744450039492 implements MigrationInterface {
    name = 'RemoveOnDeleteCasade1744450039492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "FK_e684b596b9ec2474335e7695267"`);
        await queryRunner.query(`ALTER TABLE "option_values" DROP CONSTRAINT "FK_866eecd9bde39fd5bc4b8d86369"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_8f509b13eba74e88f50da0d1133"`);
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_c46c0b39fe094c629ea1604dab3"`);
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_466a22150c3f9ad3764431d9f08"`);
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_6642dec50a7b84b586be7634e30"`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "FK_e684b596b9ec2474335e7695267" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "option_values" ADD CONSTRAINT "FK_866eecd9bde39fd5bc4b8d86369" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_8f509b13eba74e88f50da0d1133" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_c46c0b39fe094c629ea1604dab3" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_466a22150c3f9ad3764431d9f08" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_6642dec50a7b84b586be7634e30" FOREIGN KEY ("value_id") REFERENCES "option_values"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_6642dec50a7b84b586be7634e30"`);
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_466a22150c3f9ad3764431d9f08"`);
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_c46c0b39fe094c629ea1604dab3"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_8f509b13eba74e88f50da0d1133"`);
        await queryRunner.query(`ALTER TABLE "option_values" DROP CONSTRAINT "FK_866eecd9bde39fd5bc4b8d86369"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "FK_e684b596b9ec2474335e7695267"`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_6642dec50a7b84b586be7634e30" FOREIGN KEY ("value_id") REFERENCES "option_values"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_466a22150c3f9ad3764431d9f08" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_c46c0b39fe094c629ea1604dab3" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_8f509b13eba74e88f50da0d1133" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "option_values" ADD CONSTRAINT "FK_866eecd9bde39fd5bc4b8d86369" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "FK_e684b596b9ec2474335e7695267" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
