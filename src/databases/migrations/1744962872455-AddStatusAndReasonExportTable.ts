import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusAndReasonExportTable1744962872455 implements MigrationInterface {
    name = 'AddStatusAndReasonExportTable1744962872455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stocks" ADD "status" character varying(255) NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "export_stocks" ADD "reason" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stocks" DROP COLUMN "reason"`);
        await queryRunner.query(`ALTER TABLE "export_stocks" DROP COLUMN "status"`);
    }

}
