import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsEmail, Length,} from "class-validator";


@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 100)
    firstName: string;

    @Column()
    @Length(1, 100)
    lastName: string;

    @Column()
    @IsEmail()
    @Length(5, 1024)
    email: string;

}
