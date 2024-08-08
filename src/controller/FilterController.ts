import {query, Request, Response} from 'express';
import { myDS } from '../data-source';
import {DataSource} from "typeorm";
import {Agency} from "../entity/Agency";
import {PeaceOfficer} from "../entity/PeaceOfficer";
import {WorkHistory} from "../entity/WorkHistory";
import {State} from "../entity/State";
import {WorkHistoryDTO, PeaceOfficerDTO,AgencyDTO} from "./interface";


class FilterController {

    //get peace officer list with agency and state.
    static async peaceOfficerFilter(req: Request, res: Response) {
        let {stateCode, agencyName, sortBy} = req.query
        if (!stateCode) {
            return res.status(400).send("Missing state");
        }
        stateCode = String(stateCode).toUpperCase()

        //Get repositories from database
        let db: DataSource = myDS
        let agencyDB = myDS.getRepository(Agency);
        let officerDB = myDS.getRepository(PeaceOfficer);
        let stateDB = myDS.getRepository(State);
        let workHistoryDB = myDS.getRepository(WorkHistory);

        try{
            //validation:
            //check state exists:
            const state = await stateDB.findOne({ where: { stateCode } });
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
            agencyName = String(agencyName);
            const agency = await agencyDB.findOne({ where: { agencyName,state }, relations: ['state'] });
            if (!agency) {
                return res.status(404).send({ message: `No agency named ${agencyName} found in ${stateCode}` });
            }


            // Build the query to filter and sort peace officers
            // when sort is null
            let query = officerDB
                .createQueryBuilder('peaceOfficer')
                // .leftJoin('peaceOfficer.agencies', 'agencies')
                .leftJoinAndSelect('peaceOfficer.workHistoryList', 'workHistory', 'workHistory.agencyId = :agencyId', {agencyId: agency.id})
                .leftJoinAndSelect('peaceOfficer.agencies', 'agency')
                .where('agency.id = :agencyId', {agencyId: agency.id})


            //with sortBy

            // if (sortBy === "First Name") {query = query.orderBy("peaceOfficer.firstName", "ASC")}
            // if (sortBy === "Last Name") {query = query.orderBy("peaceOfficer.lastName", "ASC")}
            //TODO SORT BY UID DOES NOT WORK AS UID IS STRING
            if (sortBy) {
                query = query.orderBy(`peaceOfficer.${sortBy}`, "ASC")
            }
            const peaceOfficers = await query.getMany()
            const prettyResponse = JSON.stringify(peaceOfficers);
            // console.log("query of peaceOfficer---->", peaceOfficers)
            return res.status(200).send(`All peaceOfficers at ${agencyName}:\n${prettyResponse} `)

        } catch (err) {
            console.error('Error filtering peace officers:', err);
            res.status(500).send({ message: 'Internal server error' });
        }

    }

    //get all agencies with a selected state.
    static async stateFilter00(req: Request, res: Response) {
        let {stateCode} = req.query
        console.log("stateCode", stateCode, req.query)
        if (!stateCode) {
            return res.status(400).send("Missing State");
        }
        stateCode = String(stateCode).toUpperCase()


        //Get repositories from database
        let db: DataSource = myDS
        let stateDB = myDS.getRepository(State);
        let dataByState: State

        //check if state exists
        try {
            dataByState = await stateDB.findOne({
                where: {stateCode},
                relations: [
                    "agencies",
                    "agencies.peaceOfficers",
                    "agencies.peaceOfficers.workHistoryList",
                    "agencies.peaceOfficers.workHistoryList.agency"]
            });
            // const stateJson = JSON.stringify(dataByState)
            if (!dataByState) {
                res.status(404).send({message: 'Data for this state is on its way. Check back soon!'});
            }
        } catch (err) {
            res.status(500).send({ message: 'Internal server error' });
        }


        const agencies = dataByState.agencies

        const result: AgencyDTO[] = agencies.map(agency => ({
            id: agency.id,
            agencyName: agency.agencyName,
            //for each officer in peaceOfficerList
            // ---> each officer has a workHistoryList and for each history in historyList
            // ---> look for history.agency.id == agency.id
            peaceOfficerList: agency.peaceOfficers.map(officer=>({
                id: officer.id,
                UID: officer.UID,
                name: `${officer.firstName}  ${officer.lastName}`,
                workHistory: officer.workHistoryList.filter(history=> history.agency.id == agency.id)
                    .map(history =>({
                        id: history.id,
                        startDate:history.startDate,
                        separationDate:history.separationDate,
                        separationReason:history.separationReason,
                    }))
            }))
        }));

        const resultJson = JSON.stringify(result);
        res.status(200).send(resultJson)

    }



    //get all agencies with a selected state.
    static async stateFilter(req: Request, res: Response) {
        //receive query from client
        let {stateCode, agencyName, sortBy} = req.query
        // console.log("params from http request", req.query)

        //state code is required to get data, if no state code received, return error response
        if (!stateCode) {
            return res.status(400).send("Missing State");
        }
        stateCode = String(stateCode).toUpperCase()


        //Get repositories from database
        let db: DataSource = myDS
        let stateDB = myDS.getRepository(State);
        let agencyDB = myDS.getRepository(Agency);
        let officerDB = myDS.getRepository(PeaceOfficer);
        let workHistoryDB = myDS.getRepository(WorkHistory);
        let dataByState: State

        // 1.get all data from db with selected state, agency and sortBy are NULL
        if (!agencyName || String(agencyName).toLowerCase() === "all") {
            //check if state exists
            try {
                dataByState = await stateDB.findOne({
                    where: {stateCode},
                    relations: [
                        "agencies",
                        "agencies.peaceOfficers",
                        "agencies.peaceOfficers.workHistoryList",
                        "agencies.peaceOfficers.workHistoryList.agency"]
                });

                //if no data found under this state
                if (!dataByState) {
                    res.status(404).send({message: 'Data for this state is on its way. Check back soon!'});
                }
            } catch (err) {
                res.status(500).send({message: 'Internal server error'});
            }

            //get all data(no state id and state code)under that state and map to the new data structure that designed at interface.ts
            const agencies =  dataByState.agencies

            const result: AgencyDTO[] = agencies.map(agency => ({
                id: agency.id,
                agencyName: agency.agencyName,
                //for each officer in peaceOfficerList
                // ---> each officer has a workHistoryList and for each history in historyList
                // ---> look for history.agency.id == agency.id
                peaceOfficerList: agency.peaceOfficers.map(officer => ({
                    id: officer.id,
                    UID: officer.UID,
                    name: `${officer.firstName}  ${officer.lastName}`,
                    workHistory: officer.workHistoryList.filter(history => history.agency.id == agency.id)
                        .map(history => ({
                            id: history.id,
                            startDate: history.startDate,
                            separationDate: history.separationDate,
                            separationReason: history.separationReason,
                        }))
                }))
            }));

            const resultJson = JSON.stringify(result);
            res.status(200).send(resultJson)

        }
        //2. When agency name is selected
        else if (agencyName) {
            try{
                //get state obj to get agency under that state with typeorm db api -- use state in case different state have same agency name
                const state = await stateDB.findOne({ where: { stateCode } });
                agencyName = String(agencyName);
                const agency = await agencyDB.findOne({ where: { agencyName,state }, relations: ['state'] });
                if (!agency) {
                    return res.status(404).send({ message: `No agency named ${agencyName} found in ${stateCode}` });
                }


                // Build the query to filter and sort peace officers
                // when sortBy is null
                let query = officerDB
                    .createQueryBuilder('peaceOfficer')
                    // .leftJoin('peaceOfficer.agencies', 'agencies')
                    .leftJoinAndSelect('peaceOfficer.workHistoryList', 'workHistory', 'workHistory.agencyId = :agencyId', {agencyId: agency.id})
                    .leftJoinAndSelect('peaceOfficer.agencies', 'agency')
                    .where('agency.id = :agencyId', {agencyId: agency.id})


                //When sortBy is selected ( sortBy options: "firstName", "lastName", "UID")

                // if (sortBy === "First Name") {query = query.orderBy("peaceOfficer.firstName", "ASC")}
                // if (sortBy === "Last Name") {query = query.orderBy("peaceOfficer.lastName", "ASC")}
                //TODO SORT BY UID DOES NOT WORK AS UID IS STRING
                if (sortBy) {
                    query = query.orderBy(`peaceOfficer.${sortBy}`, "ASC")
                }
                const peaceOfficers = await query.getMany()
                const responseJson = JSON.stringify(peaceOfficers, null, 2);
                // console.log("query of peaceOfficer---->", peaceOfficers)
                return res.status(200).send(responseJson)

            } catch (err) {
                console.error('Error filtering peace officers:', err);
                res.status(500).send({ message: 'Internal server error' });
            }
            }

        }

}

export default FilterController;