Steps to run this project:
run server: 
1. Run `yarn install` command
2. Run `yarn dev:start` command

run database: 
1. create a local postgres database
2. add `.env.development` with below content:
   PORT=3300
   ENV_DEV=development
   DB_SYNC=false

   POSTGRES_USER={your user name}
   POSTGRES_PASSWORD={your password}
   POSTGRES_DB={your db name}
   POSTGRES_PORT=5432
   POSTGRES_HOST=localhost
3. run `yarn schema:sync`



Steps to generate Migration files and run:
1. Run `yarn typeorm migration:generate -d src/data-source.ts src/migration/<migrationFileName>` to generate migration file
2. Run `yarn typeorm migration:run -d src/data-source.ts` to execute it

Steps to update database schema in development env:
Run `yarn schema:sync` every time after any schema changes

