import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExportStockDetailsTable1744873517243 implements MigrationInterface {
    name = 'CreateExportStockDetailsTable1744873517243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "export_stock_details" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "export_stock_id" uuid NOT NULL, "sku_id" integer NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_cf60a16a068772bb8f4112e539b" PRIMARY KEY ("export_stock_id", "sku_id"))`);
        await queryRunner.query(`ALTER TABLE "export_stock_details" ADD CONSTRAINT "FK_2d1ba3b5c15e66f9d62e1f8bdde" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "export_stock_details" ADD CONSTRAINT "FK_cdcafb5b8a21745068dd7979b8e" FOREIGN KEY ("export_stock_id") REFERENCES "export_stocks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stock_details" DROP CONSTRAINT "FK_cdcafb5b8a21745068dd7979b8e"`);
        await queryRunner.query(`ALTER TABLE "export_stock_details" DROP CONSTRAINT "FK_2d1ba3b5c15e66f9d62e1f8bdde"`);
        await queryRunner.query(`DROP TABLE "export_stock_details"`);
    }

}
