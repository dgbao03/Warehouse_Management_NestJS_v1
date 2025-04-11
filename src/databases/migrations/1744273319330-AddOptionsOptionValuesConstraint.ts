import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOptionsOptionValuesConstraint1744273319330 implements MigrationInterface {
    name = 'AddOptionsOptionValuesConstraint1744273319330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "option_values" ADD "option_id" integer`);
        await queryRunner.query(`ALTER TABLE "option_values" ADD CONSTRAINT "UQ_5b21b4e7a7f77003bb8e064418f" UNIQUE ("option_id", "name")`);
        await queryRunner.query(`ALTER TABLE "option_values" ADD CONSTRAINT "FK_866eecd9bde39fd5bc4b8d86369" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "option_values" DROP CONSTRAINT "FK_866eecd9bde39fd5bc4b8d86369"`);
        await queryRunner.query(`ALTER TABLE "option_values" DROP CONSTRAINT "UQ_5b21b4e7a7f77003bb8e064418f"`);
        await queryRunner.query(`ALTER TABLE "option_values" DROP COLUMN "option_id"`);
    }

}
