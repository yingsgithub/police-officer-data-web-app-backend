import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import {State} from "./State";


@Entity()
export class Agency {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 100)
    agencyName: string;

    @ManyToOne(() => State, state => state.agencies)
    state: State;

    //todo many to many  Agency <==> peaceOfficer
}
