import { Request, Response } from 'express';
import { myDS } from '../data-source';
import { User } from '../entity/User';
import fs from 'fs';
import csvParser from 'csv-parser';
import {parse} from '@fast-csv/parse';
import {DataSource} from "typeorm";
import {Agency} from "../entity/Agency";
import {PeaceOfficer} from "../entity/PeaceOfficer";
import {WorkHistory} from "../entity/WorkHistory";
import {State} from "../entity/State";




class FileController {
    // Existing methods...

    static async readCSVFileInStream(req: Request, res: Response) {
        
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const filePath = req.file.path;
        console.log("File Path--->", filePath);
        // const userDB = myDS.getRepository(User);
        const maxRows  = 5; //number of rows to read at a time
        let rowCount = 0;
        const results: any[] = [];

        const stream = fs.createReadStream(filePath)
            .pipe(parse({headers:true}))
            .on('data', (row) => {
                console.log("row--->", row['Agency Name']);
                if (rowCount < maxRows) {
                    results.push(row);
                    rowCount++;
                }
                if (rowCount >= maxRows) {
                    stream.destroy();
                }
            })
            .on('close', () => {
                console.log("results--->", results);
                res.status(200).send(results);
                fs.unlinkSync(filePath); // Clean up the uploaded file
            })
            .on('error', (error) => {
                console.error("Error reading CSV file", error);
                res.status(500).send("Error reading CSV file");
                fs.unlinkSync(filePath); // Clean up the uploaded file
            });
    }

    static async uploadCSV(req:Request, res:Response) {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
        let { stateCode } = req.body;
        if (!stateCode) {
            return res.status(400).send("Missing State");
        }
        stateCode = stateCode.toUpperCase()

        const filePath = req.file.path;
        const maxRows = 100; // number of rows to read at a time

        let db: DataSource = myDS;
        let agencyDB = myDS.getRepository(Agency);
        let officerDB = myDS.getRepository(PeaceOfficer);
        let stateDB = myDS.getRepository(State);
        let workHistoryDB = myDS.getRepository(WorkHistory);

        try {
            let state = await stateDB.findOne({ where: { stateCode } });
            if (!state) {
                state = stateDB.create({ stateCode });
                await stateDB.save(state);
            }

            const stream = fs.createReadStream(filePath)
                .pipe(parse({ headers: true, maxRows: maxRows }));

            const processRow = async (row) => {
                const agencyName = row['Agency Name'];
                const UID = row.UID;
                const firstName = row['First Name'];
                const lastName = row['Last Name'];
                let startDate = row['Start Date'];
                let separationDate = row['Separation Date'];
                const separationReason = row['Separation Reason'];

                let agency = await agencyDB.findOne({ where: { agencyName, state } });
                if (!agency) {
                    agency = agencyDB.create({ agencyName, state });
                    await agencyDB.save(agency);
                    console.log("successfully saved agency--->", agency);
                }

                let officer = await officerDB
                    .createQueryBuilder("peaceOfficer")
                    .leftJoinAndSelect("peaceOfficer.agencies", "agencies")
                    .leftJoinAndSelect("agencies.state", "state")
                    .where("peaceOfficer.UID = :UID", { UID })
                    .andWhere("state.id = :stateId", { stateId: state.id })
                    .getOne();
                console.log("after saving new agency, build a officer query builder to check if this officer exists", officer);
                if (!officer) {
                    console.log("A- officer is not exist, create a new object")
                    officer = officerDB.create({ UID, firstName, lastName });
                    officer.agencies = [agency];
                    console.log("B - new officer created", officer);
                    await officerDB.save(officer);
                    console.log("C-successfully saved officer!!!!!!!", officer);
                } else {
                    console.log("1.officer is exist! let's check their agencies--->", officer.agencies)
                    const isAgencyLinked = officer.agencies.includes(agency);
                    console.log("2. Is this officer's agency list includes current agency:", isAgencyLinked)
                    if (!isAgencyLinked) {
                        console.log("3.1 if isAgencyLinked is false, add the agency to the officer.agencies");
                        officer.agencies.push(agency);
                        await officerDB.save(officer);
                        console.log("3.3 save officer to db-->", officer.agencies);
                    }
                }


                //find or add the work history
                // Convert start and separation dates to Date objects if they exist
                startDate = startDate ? startDate : null;
                separationDate = separationDate ? separationDate : null;
                //check if the history is already added with the officer at same agency
                const workHistory = await workHistoryDB.findOne({
                    where: {
                        peaceOfficer: officer,
                        agency: agency,
                        startDate,
                        separationDate,
                    },
                    relations: ['peaceOfficer', 'agency'],
                });
                console.log("WH01 existing workHistory--->", workHistory);

                if (!workHistory) {
                    console.log("WH02 workingHistory not existing, create a new obj of it")
                    const newWorkHistory = workHistoryDB.create({
                        startDate,
                        separationDate,
                        separationReason,
                        peaceOfficer: officer,
                        agency
                    });
                    console.log("WH03 new workHistory--->", newWorkHistory);
                    await workHistoryDB.save(newWorkHistory);
                    console.log("WH4 successfully saved workHistory to database-->", newWorkHistory);
                }
            };


            for await (const row of stream) {
                await processRow(row);
                console.log("next row starts")
            }

            res.status(200).send("Successfully saved data to database");
            fs.unlinkSync(filePath); // Clean up the uploaded file
        } catch (err) {
            console.error("Error processing data", err);
            res.status(500).send("Error processing data");
            fs.unlinkSync(filePath); // clean up the uploaded file
        }

    }
}




export default FileController;