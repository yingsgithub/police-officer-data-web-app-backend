import {DataSource} from "typeorm";
import * as dotenv from "dotenv";
import path from "path";
import {User} from "./entity/User";
import {Agency} from "./entity/Agency";
import {PeaceOfficer} from "./entity/PeaceOfficer";
import {State} from "./entity/State";
import {WorkHistory} from "./entity/WorkHistory";

dotenv.config({path: `.env.${process.env.NODE_ENV}`});
console.log('Database User:', process.env.POSTGRES_USER);
console.log('Database Password:', process.env.POSTGRES_PASSWORD);
console.log('Database Name:', process.env.POSTGRES_DB);
export const myDS = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize:  process.env.DB_SYNC ? process.env.DB_SYNC.toLowerCase() === 'true' : false,
    // logging: ["error", "query", "schema"],
    logging: ["error"],
    // entities: ["build/**/*.entity.ts"],I
    entities: [User, Agency, PeaceOfficer, State, WorkHistory],
    // entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: [User, Agency, PeaceOfficer, State, WorkHistory],
    // migrations: ["build/**/*.migrations.js"],
    // migrations: [path.join(__dirname, '**', '*.migrations.{ts,js}')],
    // subscribers: ["build/**/*.subscribers.js"],
    subscribers: [User, Agency, PeaceOfficer, State, WorkHistory],
    // subscribers: [path.join(__dirname, '**', '*.subscribers.{ts,js}')],
})
// console.log("--->", process.env.DB_SYNC==='true', typeof (process.env.DB_SYNC==='true'))
