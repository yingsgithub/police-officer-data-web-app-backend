import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import {State} from "./State";
import {PeaceOfficer} from "./PeaceOfficer";


@Entity()
export class Agency {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 100)
    agencyName: string;

    @ManyToOne(() => State, state => state.agencies)
    state: State;

    @ManyToMany(() => PeaceOfficer, peaceOfficer => peaceOfficer.agencies)
    peaceOfficers: PeaceOfficer[];
}
