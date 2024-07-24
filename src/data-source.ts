import {DataSource} from "typeorm";
import {User} from "./entity/User";

export const myDS = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    // username: process.env.POSTGRES_USERNAME,
    username: "postgres",
    // password: process.env.POSTGRES_PASSWORD,
    password: "postgres",
    database: "c21_database",
    synchronize: true,
    logging: true,
    // entities: ["src/entity/**/*.ts"],
    entities: [User],
    subscribers: [],
    migrations: [],
})