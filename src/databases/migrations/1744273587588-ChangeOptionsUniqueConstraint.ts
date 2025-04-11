import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOptionsUniqueConstraint1744273587588 implements MigrationInterface {
    name = 'ChangeOptionsUniqueConstraint1744273587588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "UQ_451caf7560009fc1ba24438f607"`);
        // await queryRunner.query(`CREATE TABLE "product_skus" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "UQ_a62a7f4dd9eb3f6473d277a48d8" UNIQUE ("name"), CONSTRAINT "PK_2acf028b6a5492960021db0273a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "UQ_0f32c12e831cb1214625e117ea0" UNIQUE ("product_id", "name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "UQ_0f32c12e831cb1214625e117ea0"`);
        // await queryRunner.query(`DROP TABLE "product_skus"`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "UQ_451caf7560009fc1ba24438f607" UNIQUE ("id", "product_id")`);
    }

}
