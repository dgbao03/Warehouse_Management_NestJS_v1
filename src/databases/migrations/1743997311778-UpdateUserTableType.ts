import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableType1743997311778 implements MigrationInterface {
    name = 'UpdateUserTableType1743997311778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullname" TYPE text`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE text`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" TYPE text`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
      }
      

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullname" character varying NOT NULL`);
    }

}
