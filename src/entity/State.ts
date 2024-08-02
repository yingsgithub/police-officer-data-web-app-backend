import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import {Agency} from "./Agency";



@Entity()
export class State {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    stateName: string;

    // @Column({unique:true})
    // stateCode: string;

    @OneToMany(() => Agency, agency => agency.state)
    agencies: Agency[];

}
