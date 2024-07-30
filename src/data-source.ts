import {DataSource} from "typeorm";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
import {User} from "./entity/User";

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
    logging: ["error", "query", "schema"],
    // entities: ["build/**/*.entity.ts"],
    entities: [User],
    // entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: [User],
    // migrations: ["build/**/*.migrations.js"],
    // migrations: [path.join(__dirname, '**', '*.migrations.{ts,js}')],
    // subscribers: ["build/**/*.subscribers.js"],
    subscribers: [User],
    // subscribers: [path.join(__dirname, '**', '*.subscribers.{ts,js}')],
})
// console.log("--->", process.env.DB_SYNC==='true', typeof (process.env.DB_SYNC==='true'))
