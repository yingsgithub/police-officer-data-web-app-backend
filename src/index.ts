import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import dotenv from "dotenv";
import {createConnection} from "typeorm";
const cors = require("cors");

dotenv.config();
console.log("PORT:", process.env.PORT);

// const SERVER_PORT = process.env.PORT;
const SERVER_PORT:number= 3300;

const startServer = async () => {

    // todo: connect database
    //create express app
    const app = express(); //http server
    app.use(cors());
    app.use(bodyParser.json());
    app.disable('x-powered-by');
    app.use('/', (req, res) => {
        res.send('hello world!');
    })

    //start express server
    const server = app.listen(SERVER_PORT, () => {
        console.log(`NODE_ENV is : ${process.env.NODE_ENV}. \n Server is running on port ${SERVER_PORT}.`);
    })

}

startServer()

