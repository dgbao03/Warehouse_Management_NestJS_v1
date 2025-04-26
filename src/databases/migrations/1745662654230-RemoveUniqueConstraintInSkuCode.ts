import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueConstraintInSkuCode1745662654230 implements MigrationInterface {
    name = 'RemoveUniqueConstraintInSkuCode1745662654230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" DROP CONSTRAINT "UQ_8b73bb4f9f6f5eb00a99e147ee5"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_skus" ADD CONSTRAINT "UQ_8b73bb4f9f6f5eb00a99e147ee5" UNIQUE ("code")`);
    }

}
