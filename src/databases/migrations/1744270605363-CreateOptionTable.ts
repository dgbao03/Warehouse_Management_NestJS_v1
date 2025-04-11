import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOptionTable1744270605363 implements MigrationInterface {
    name = 'CreateOptionTable1744270605363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "options" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_d232045bdb5c14d932fba18d957" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "options"`);
    }

}
