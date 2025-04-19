import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnumValueToStatusColumn1744964496334 implements MigrationInterface {
    name = 'AddEnumValueToStatusColumn1744964496334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stocks" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."export_stocks_status_enum" AS ENUM('Pending', 'Completed', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "export_stocks" ADD "status" "public"."export_stocks_status_enum" NOT NULL DEFAULT 'Pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "export_stocks" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."export_stocks_status_enum"`);
        await queryRunner.query(`ALTER TABLE "export_stocks" ADD "status" character varying(255) NOT NULL DEFAULT 'pending'`);
    }

}
