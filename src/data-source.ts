import {DataSource} from "typeorm";
import * as dotenv from "dotenv";
import path from "path";
import {User} from "./entity/User";
import {Agency} from "./entity/Agency";
import {PeaceOfficer} from "./entity/PeaceOfficer";
import {State} from "./entity/State";
import {WorkHistory} from "./entity/WorkHistory";

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

// Define the SSL configuration conditionally
const sslConfig = process.env.NODE_ENV === 'production' ? {
    ssl: {
        rejectUnauthorized: false,
    }
} : {};

export const myDS = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize:  process.env.DB_SYNC ? process.env.DB_SYNC.toLowerCase() === 'true' : false,
    // logging: ["error", "query", "schema"],
    logging: ["error"],
    // ssl: {
    //     rejectUnauthorized: false,
    // },
    entities: [User, Agency, PeaceOfficer, State, WorkHistory],
    // migrations: [path.join(__dirname, '**', '*.migration.{ts,js}')],
    migrations: [path.join(__dirname, 'migration', '**', '*.{ts,js}')],

    // subscribers: [path.join(__dirname, '**', '*.subscribers.{ts,js}')],
    // subscribers: [User, Agency, PeaceOfficer, State, WorkHistory],
    // entities: ["build/**/*.entity.ts"],I
    // entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    // migrations: [User, Agency, PeaceOfficer, State, WorkHistory],
    // migrations: ["src/**/*.migration.ts"],
    // migrations: ["src/migration/*.ts"],
    subscribers: ["src/subscribers/*.ts"],
    // subscribers: ["build/**/*.subscribers.js"],
    "migrationsTableName": "migrations",
    ...sslConfig
})

// console.log('Database User:', process.env.POSTGRES_USER);
// console.log('Database Password:', process.env.POSTGRES_PASSWORD);
// console.log('Database Name:', process.env.POSTGRES_DB);
// console.log('Database Host:', process.env.POSTGRES_HOST);