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
            // .on('end', (rowCount: number) => {
            //     console.log("results--->", results);
            //     res.status(200).send(results);
            //     fs.unlinkSync(filePath); // Clean up the uploaded file
            
                // try {
                //     await userDB.save(users);
                //     res.status(200).send("Users added successfully");
                // } catch (error) {
                //     console.log("Error saving users", error);
                //     res.status(500).send("Error saving users");
                // } finally {
                //     fs.unlinkSync(filePath); // Clean up the uploaded file
                // }
            // })
            .on('error', (error) => {
                console.error("Error reading CSV file", error);
                res.status(500).send("Error reading CSV file");
                fs.unlinkSync(filePath); // Clean up the uploaded file
            });
    }


    static async uploadCSV(req: Request, res: Response) {
        //check if request body is empty: request body should contain a csv file and a stateName
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }
        const {stateName} = req.body;
        console.log("req.body--->", stateName);

        if (!stateName) {
            return res.status(400).send("Missing State");
        }

        //get filepath
        const filePath = req.file.path;
        console.log("File Path--->", filePath);
        const maxRows = 10; //number of rows to read at a time

        //Get repositories from database
        let db: DataSource = myDS
        let agencyDB = myDS.getRepository(Agency);
        let officerDB = myDS.getRepository(PeaceOfficer);
        let stateDB = myDS.getRepository(State);
        let workHistoryDB = myDS.getRepository(WorkHistory);

        //save to database
        try {
            //todo save state. Do i need to seed state first ?
            let state = await stateDB.findOne({ where: {stateName} });
            if (!state) {
                state = stateDB.create({stateName});
                await stateDB.save(state);
            }

            const stream = fs.createReadStream(filePath)
                .pipe(parse({headers:true, maxRows:maxRows}))
                .on('data', async (row) => {
                    // console.log("row--->", row);
                    //todo-if have time: check format transition in fast-csv to make destructure bc there are space between the headers in csv
                        // Destructure and process CSV row
                        // const {AgencyName, UID, FirstName, LastName, StartDate, SeparationDate, SeparationReason} = row
                        const agencyName = row['Agency Name'];
                        const UID = row.UID;
                        const firstName = row['First Name'];
                        const lastName = row['Last Name'];
                        let startDate = row['Start Date'];
                        let separationDate = row['Separation Date'];
                        const separationReason = row['Separation Reason'];

                        console.log("rowData--->", agencyName, UID, firstName, lastName);

                        // Find or add the agency
                        //check if agency already exists in the state
                        let agency = await agencyDB.findOne({
                            where: {
                                agencyName,
                                state
                            }});
                        console.log("agency--->", agency);
                        if (!agency) {
                            agency = agencyDB.create({agencyName, state});
                            await agencyDB.save(agency)
                        }


                        //find or add the peace officer
                        //check if officer with same UID in the same state exits
                        let officer = await officerDB
                            .createQueryBuilder("peaceOfficer")
                            .leftJoinAndSelect("peaceOfficer.agencies", "agencies")
                            .leftJoinAndSelect("agencies.state", "state")
                            .where("peaceOfficer.UID = :UID", {UID})
                            .andWhere("state.id = :stateId", {stateId: state.id})
                            .getOne()

                        // console.log("state", state, state.id)
                        console.log("officer query builder", officer)
                        if (!officer) {
                            //if no officer found, create a new officer obj
                            //todo - validate entity schema
                            officer = officerDB.create({UID, firstName, lastName})
                            officer.agencies = [agency];
                            console.log("new officer", officer)
                        } else {
                            //check if agency in officer.agencies
                            const isAgencyLinked = officer.agencies.some(existingAgency => existingAgency.id === agency.id);
                            if (!isAgencyLinked) { officer.agencies.push(agency); }
                        }

                        //save officer to db
                        await officerDB.save(officer);


                        //find or add the work history
                        // Convert start and separation dates to Date objects if they exist
                        //todo if have time: restructure date without time 00:00::00
                        startDate = startDate ? new Date(startDate) : null;
                        separationDate = separationDate ? new Date(separationDate) : null;
                        //check if the history is already added with the officer at same agency
                        const workHistory = await workHistoryDB.findOne({
                            where: {
                                peaceOfficer: officer,
                                startDate,
                                separationDate,
                            },
                            relations: ['peaceOfficer', "peaceOfficer.agencies"],
                        });
                        console.log("existing workHistory--->", workHistory);

                        //if the period doesn't exist, add it
                        if (!workHistory) {
                            const newWorkHistory = workHistoryDB.create({
                                peaceOfficer: officer,
                                startDate,
                                separationDate,
                                separationReason
                            });
                            await workHistoryDB.save(newWorkHistory);
                        }
                })
                .on('close', () => {
                    // console.log("results--->", results);
                    res.status(200).send("Successfully saved data to database");
                    fs.unlinkSync(filePath); // Clean up the uploaded file
                })
        } catch (err) {
            console.error("Error processing data", err);
            res.status(500).send("Error processing data");
            fs.unlinkSync(filePath); // clean up the uploaded file
        }
    }


}




export default FileController;