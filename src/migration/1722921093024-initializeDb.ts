import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeDb1722921093024 implements MigrationInterface {
    name = 'InitializeDb1722921093024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "age" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "state" ("id" SERIAL NOT NULL, "stateName" character varying NOT NULL, CONSTRAINT "UQ_5a62ce4a87c45fd68c3eece2006" UNIQUE ("stateName"), CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_history" ("id" SERIAL NOT NULL, "startDate" character varying, "separationDate" character varying, "separationReason" character varying NOT NULL, "peaceOfficerId" integer, "agencyId" integer, CONSTRAINT "PK_0c1d1173396df573362f803108d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "peace_officer" ("id" SERIAL NOT NULL, "UID" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "UQ_f0ca7e0eb8c4cf98c926a423f0c" UNIQUE ("UID"), CONSTRAINT "PK_845f0ca9fccd0134242a8de0949" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agency" ("id" SERIAL NOT NULL, "agencyName" character varying NOT NULL, "stateId" integer, CONSTRAINT "UQ_bd202ccf4f4daad6d1cb4d925f9" UNIQUE ("agencyName", "stateId"), CONSTRAINT "PK_ab1244724d1c216e9720635a2e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "peace_officer_agencies_agency" ("peaceOfficerId" integer NOT NULL, "agencyId" integer NOT NULL, CONSTRAINT "PK_834e6d767aba79622d6bf7fd3c5" PRIMARY KEY ("peaceOfficerId", "agencyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7c54e47d5a98ff731f20c7fb47" ON "peace_officer_agencies_agency" ("peaceOfficerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_927e13974eea699b420d2b5b3b" ON "peace_officer_agencies_agency" ("agencyId") `);
        await queryRunner.query(`ALTER TABLE "work_history" ADD CONSTRAINT "FK_3d333b9a377c834136a2dfc2766" FOREIGN KEY ("peaceOfficerId") REFERENCES "peace_officer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_history" ADD CONSTRAINT "FK_d33380031b1ea696ec8ec32dcde" FOREIGN KEY ("agencyId") REFERENCES "agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agency" ADD CONSTRAINT "FK_fd6ea0a727682de4a54ebdc5fee" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" ADD CONSTRAINT "FK_7c54e47d5a98ff731f20c7fb470" FOREIGN KEY ("peaceOfficerId") REFERENCES "peace_officer"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" ADD CONSTRAINT "FK_927e13974eea699b420d2b5b3bd" FOREIGN KEY ("agencyId") REFERENCES "agency"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" DROP CONSTRAINT "FK_927e13974eea699b420d2b5b3bd"`);
        await queryRunner.query(`ALTER TABLE "peace_officer_agencies_agency" DROP CONSTRAINT "FK_7c54e47d5a98ff731f20c7fb470"`);
        await queryRunner.query(`ALTER TABLE "agency" DROP CONSTRAINT "FK_fd6ea0a727682de4a54ebdc5fee"`);
        await queryRunner.query(`ALTER TABLE "work_history" DROP CONSTRAINT "FK_d33380031b1ea696ec8ec32dcde"`);
        await queryRunner.query(`ALTER TABLE "work_history" DROP CONSTRAINT "FK_3d333b9a377c834136a2dfc2766"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_927e13974eea699b420d2b5b3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c54e47d5a98ff731f20c7fb47"`);
        await queryRunner.query(`DROP TABLE "peace_officer_agencies_agency"`);
        await queryRunner.query(`DROP TABLE "agency"`);
        await queryRunner.query(`DROP TABLE "peace_officer"`);
        await queryRunner.query(`DROP TABLE "work_history"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
