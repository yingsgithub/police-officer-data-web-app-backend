import "reflect-metadata";
import express from "express";
import * as bodyParser from "body-parser";
import dotenv from "dotenv";
import {myDS} from "./data-source";
import {User} from "./entity/User";
import routes from "./routes";
import e from "express";
import cors from "cors";
import path from "path";

// dotenv.config();
// require('dotenv').config({ path: path.join(__dirname, `../.env.development.${process.env.NODE_ENV}`)});
dotenv.config({ path: path.join(__dirname, `../.env.development.${process.env.NODE_ENV}`)});

// require('dotenv-flow').config();


const SERVER_PORT = process.env.PORT || 3000;
//create express app
let app: express.Application //http server
let server: any

const startServer = async () => {

    // connect database
    try {
        await myDS.initialize()
        console.log('Data Source has been initialized');
        // const app = express(); //http server

        //create express app
        const app = express(); //http server
        app.use(cors());
        app.use(bodyParser.json());
        app.disable('x-powered-by');

        //register routes
        app.use('/', routes);

        //start express server
        server = app.listen(SERVER_PORT, () => {
            console.log(`NODE_ENV is : ${process.env.NODE_ENV}. \n Server is running on port ${SERVER_PORT}.`);
        })
    }catch(err){
        console.error('Error Server Initializing...', err);
        process.exit(1);
    }

}

startServer()

const stopServer = () => {
    if (server) {
        server.close();
    }
}
export {app, server,startServer, stopServer}; //exporting the app for testing
