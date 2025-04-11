import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOptionValueTable1744271200796 implements MigrationInterface {
    name = 'CreateOptionValueTable1744271200796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "option_values" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_832b9dfff8b853260189e4d0645" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "option_values"`);
    }

}
