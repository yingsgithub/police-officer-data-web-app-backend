import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import { PeaceOfficer } from './PeaceOfficer';
import {Agency} from "./Agency";


@Entity()
export class WorkHistory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    startDate: string;

    @Column({nullable: true})
    separationDate: string;

    @Column()
    @Length(1, 100)
    separationReason: string;

    @ManyToOne(() => PeaceOfficer, peaceOfficer => peaceOfficer.workHistoryList)
    peaceOfficer: PeaceOfficer;

    @ManyToOne(() => Agency, agency => agency.workHistoryList )
    agency:Agency;
}