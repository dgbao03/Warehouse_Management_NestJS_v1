import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExportStockTableAndAddingUserConstraint1744872380069 implements MigrationInterface {
    name = 'CreateExportStockTableAndAddingUserConstraint1744872380069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "export_stocks" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "user_id" uuid, CONSTRAINT "PK_253b99889614bd7fc3ac9cc39d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "export_stocks" ADD CONSTRAINT "FK_e36d2b99eb90d69c5f42a97112b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stocks" DROP CONSTRAINT "FK_e36d2b99eb90d69c5f42a97112b"`);
        await queryRunner.query(`DROP TABLE "export_stocks"`);
    }

}
