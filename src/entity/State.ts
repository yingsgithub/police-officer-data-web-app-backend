import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Length,} from "class-validator";
import {Agency} from "./Agency";



@Entity()
export class State {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    @Length(1, 3)
    stateCode: string;

    @OneToMany(() => Agency, agency => agency.state)
    agencies: Agency[];

}
