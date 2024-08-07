import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import { WorkHistory } from './WorkHistory';
import {Agency} from "./Agency";


@Entity()
@Unique(["UID"])
export class PeaceOfficer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 100)
    UID: string;

    @Column()
    @Length(1, 100)
    firstName: string;

    @Column()
    @Length(1, 100)
    lastName: string;

    @OneToMany(() => WorkHistory, workHistory => workHistory.peaceOfficer)
    workHistoryList: WorkHistory[];

    @ManyToMany(()=>Agency, agency => agency.peaceOfficers)
    @JoinTable()
    agencies: Agency[];
}
