import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStateNameToStateCode1723056688367 implements MigrationInterface {
    name = 'ChangeStateNameToStateCode1723056688367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" DROP CONSTRAINT "FK_927e13974eea699b420d2b5b3bd"`);
        await queryRunner.query(`ALTER TABLE "state" RENAME COLUMN "stateName" TO "stateCode"`);
        await queryRunner.query(`ALTER TABLE "state" RENAME CONSTRAINT "UQ_5a62ce4a87c45fd68c3eece2006" TO "UQ_f97df79862ffbb31fe3d4d29792"`);
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" ADD CONSTRAINT "FK_927e13974eea699b420d2b5b3bd" FOREIGN KEY ("agencyId") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" DROP CONSTRAINT "FK_927e13974eea699b420d2b5b3bd"`);
        await queryRunner.query(`ALTER TABLE "state" RENAME CONSTRAINT "UQ_f97df79862ffbb31fe3d4d29792" TO "UQ_5a62ce4a87c45fd68c3eece2006"`);
        await queryRunner.query(`ALTER TABLE "state" RENAME COLUMN "stateCode" TO "stateName"`);
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" ADD CONSTRAINT "FK_927e13974eea699b420d2b5b3bd" FOREIGN KEY ("agencyId") REFERENCES "agency"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
