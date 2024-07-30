Steps to run this project:
run server: 
1. Run `yarn install` command
2. Run `yarn dev:start` command



Steps to generate Migration files and run:
1. Run `yarn typeorm migration:generate -d src/data-source.ts src/migration/<migrationFileName>`
2. Run `yarn typeorm migration:run -d src/data-source.ts`