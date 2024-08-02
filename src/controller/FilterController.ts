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


class FilterController {
    // Existing methods...

    static async peaceOfficerFilter(req: Request, res: Response) {
        let {stateName, agencyName, sortBy} = req.body

        //Get repositories from database
        let db: DataSource = myDS
        let agencyDB = myDS.getRepository(Agency);
        let officerDB = myDS.getRepository(PeaceOfficer);
        let stateDB = myDS.getRepository(State);
        let workHistoryDB = myDS.getRepository(WorkHistory);

        try{
            //validation:
            //check state exists:
            const state = await stateDB.findOne({ where: { stateName } });
            if (!state) {
                return res.status(404).send({ message: 'Hold tight! The data for this state is on its way. Check back soon!' });
            }

            //check agency exists
            //if not agencyName, assign the fist available value to it as default value
            if (!agencyName) {
                const defaultAgency = await agencyDB.findOne({ where: { state }, relations: ['state']});
                //if no agency exits return err message
                if (!defaultAgency) {
                    return res.status(404).send({ message: 'No agency found in the specified state' });
                } else {
                //assign default value
                agencyName = defaultAgency.agencyName;
                }
            }

            const agency = await agencyDB.findOne({ where: { agencyName,state }, relations: ['state'] });
            if (!agency) {
                return res.status(404).send({ message: 'Agency found in the specified state' });
            }


            //Build the query to filter and sort peace officers
            //when sort is null
            let query = officerDB
                .createQueryBuilder('peaceOfficer')
                .leftJoinAndSelect('peaceOfficer.workHistoryList', 'workHistoryList')
                .leftJoin('peaceOfficer.agencies', 'agency')
                .where('agency.id = :agencyId', {agencyId: agency.id})

            //with sortBy

            // if (sortBy === "First Name") {query = query.orderBy("peaceOfficer.firstName", "ASC")}
            // if (sortBy === "Last Name") {query = query.orderBy("peaceOfficer.lastName", "ASC")}
            // if (sortBy === "UID") {query = query.orderBy("peaceOfficer.UID", "ASC")}
            if (sortBy) {
                query = query.orderBy(`peaceOfficer.${sortBy}`, "ASC")
            }
            const peaceOfficers = await query.getMany()
            const prettyResponse = JSON.stringify(peaceOfficers);


            console.log("query of peaceOfficer---->", peaceOfficers)
            return res.status(200).send(`All peaceOfficers at ${agencyName}:\n${prettyResponse} `)

        } catch (err) {
            console.error('Error filtering peace officers:', err);
            res.status(500).send({ message: 'Internal server error' });
        }

    }



}




export default FilterController;