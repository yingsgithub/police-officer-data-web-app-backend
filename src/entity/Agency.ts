import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import {State} from "./State";
import {PeaceOfficer} from "./PeaceOfficer";
import {WorkHistory} from "./WorkHistory";


@Entity()
@Unique(["agencyName", "state"])
export class Agency {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 100)
    agencyName: string;

    @ManyToOne(() => State, state => state.agencies)
    state: State;

    @ManyToMany(() => PeaceOfficer, peaceOfficer => peaceOfficer.agencies, {cascade:true})
    peaceOfficers: PeaceOfficer[];

    @OneToMany(() => WorkHistory, workHistory => workHistory.agency, {cascade:true})
    workHistoryList: WorkHistory[];
}
