import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import { PeaceOfficer } from './PeaceOfficer';


@Entity()
export class WorkHistory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    startDate: Date;

    @Column({nullable: true})
    separationDate: Date;

    @Column()
    @Length(1, 100)
    separationReason: string;

    @ManyToOne(() => PeaceOfficer, peaceOfficer => peaceOfficer.workHistoryList)
    peaceOfficer: PeaceOfficer;
}