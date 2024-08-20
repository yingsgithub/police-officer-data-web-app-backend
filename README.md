# Police Officer Employment History Backend

## Introduction
This backend server is build for police officer employment history data web app, in collaborating with the 
Invisible Institute, a Chicago based non-profit behind The Civic Police Data Project(CDCP.co).
This project aims to create tools that hold police accountable to the public they serve.

This backend is built with Node.js/Express/Typescript/Postgresql/TypeOrm, and provides two major features: 
1. Endpoint to upload large data csv files containing police officer employment history data
2. Endpoint to retrieve, filter and sort data 


## Project Setup

### Running the Server in Development Environment
 
1. Run `yarn install` command to install dependencies
2. Run `yarn dev:start` command to start the server 

### Set up the database
1. create a local postgres database
2. create a `.env.development` file with the following content:
   PORT= {your defined port}
   ENV_DEV=development
   DB_SYNC=false

   POSTGRES_USER={your user name}
   POSTGRES_PASSWORD={your password}
   POSTGRES_DB={your db name}
   POSTGRES_PORT=5432
   POSTGRES_HOST=localhost
3. run `yarn schema:sync` to sync database schema or can set DB_SYNC=true to sync database schema changes directly  



### Steps to generate Migration files and run in prod env when there is updates in database schema :
1. Run `yarn migration:generate src/migration/<migrationFileName>` to generate migration file
2. Run `yarn migration:run` to run the migration

### Steps to update database schema in development env:
Run `yarn schema:sync` every time after making schema changes


## Deployment
### The backend is deployed at: https://police-officer-data-web-app-backend.onrender.com
### The frontend is deployed at: https://post-front-end-nine.vercel.app/



