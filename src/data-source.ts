import {DataSource} from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();
import {User} from "./entity/User";

export const myDS = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.POSTGRES_USERNAME,
    // username: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    // password: "postgres",
    database: "c21_database",
    synchronize:  process.env.DB_SYNC.toLowerCase() === 'true',
    logging: ["error"],
    entities: ["src/entity/**/*.ts"],
    // entities: [User],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
})
// console.log("--->", process.env.DB_SYNC==='true', typeof (process.env.DB_SYNC==='true'))
