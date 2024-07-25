import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import dotenv from "dotenv";
import {createConnection} from "typeorm";
import {myDS} from "./data-source";
import {User} from "./entity/User";
import routes from "./routes";
const cors = require("cors");
const path = require("path");

dotenv.config();
// require('dotenv').config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`)});
// dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`)});

// require('dotenv-flow').config();


const SERVER_PORT = process.env.PORT;

const startServer = async () => {

    // connect database
    try {
        await myDS.initialize()
        console.log('Data Source has been initialized');

        //create express app
        const app = express(); //http server
        app.use(cors());
        app.use(bodyParser.json());
        app.disable('x-powered-by');

        //register routes
        app.use('/', routes)

        //start express server
        const server = app.listen(SERVER_PORT, () => {
            console.log(`NODE_ENV is : ${process.env.NODE_ENV}. \n Server is running on port ${SERVER_PORT}.`);
        })
    }catch(err){
        console.error('Error Server Initializing...', err);
        process.exit(1);
    }

}

startServer()

