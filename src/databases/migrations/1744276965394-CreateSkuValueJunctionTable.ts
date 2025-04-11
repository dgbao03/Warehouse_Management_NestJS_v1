import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSkuValueJunctionTable1744276965394 implements MigrationInterface {
    name = 'CreateSkuValueJunctionTable1744276965394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sku_values" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "sku_id" integer NOT NULL, "option_id" integer NOT NULL, "value_id" integer NOT NULL, CONSTRAINT "PK_80df7a65580870a83d5dda866a4" PRIMARY KEY ("sku_id", "option_id"))`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "PK_2acf028b6a5492960021db0273a"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "PK_2acf028b6a5492960021db0273a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_c46c0b39fe094c629ea1604dab3" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_466a22150c3f9ad3764431d9f08" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sku_values" ADD CONSTRAINT "FK_6642dec50a7b84b586be7634e30" FOREIGN KEY ("value_id") REFERENCES "option_values"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_6642dec50a7b84b586be7634e30"`);
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_466a22150c3f9ad3764431d9f08"`);
        await queryRunner.query(`ALTER TABLE "sku_values" DROP CONSTRAINT "FK_c46c0b39fe094c629ea1604dab3"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "PK_2acf028b6a5492960021db0273a"`);
        await queryRunner.query(`ALTER TABLE "product_skus" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "PK_2acf028b6a5492960021db0273a" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "sku_values"`);
    }

}
