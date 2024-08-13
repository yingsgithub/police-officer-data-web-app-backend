import {query, Request, Response} from 'express';
import { myDS } from '../data-source';
import {DataSource} from "typeorm";
import {Agency} from "../entity/Agency";
import {PeaceOfficer} from "../entity/PeaceOfficer";
import {WorkHistory} from "../entity/WorkHistory";
import {State} from "../entity/State";
import {AgencyDTO} from "./interface";



class FilterController {

    //get all agencies with a selected state.
    static async stateFilter(req: Request, res: Response) {
        //receive query from client
        let {
            stateCode,
            agencyName,
            sortBy,
            UID,
            firstName,
            lastName
        } = req.query
        // console.log("params from http request", req.query)

        //state code is required to get data, if no state code received, return error response
        if (!stateCode) {
            return res.status(400).send("Missing State");
        }
        stateCode = String(stateCode).toUpperCase()


        //Get repositories from database
        let db: DataSource = myDS
        let stateDB = db.getRepository(State);
        let agencyDB = db.getRepository(Agency);
        let officerDB = db.getRepository(PeaceOfficer);
        let workHistoryDB = db.getRepository(WorkHistory);
        let dataByState: State

        // get all data from db with selected state, agency and sortBy are NULL
        if (!lastName && !firstName && !UID && (!agencyName || String(agencyName).toLowerCase() === "all")) {

            //check if state exists
            try {
                dataByState = await stateDB.findOne({
                    where: {stateCode},
                    relations: [
                        "agencies",
                        "agencies.peaceOfficers",
                        "agencies.peaceOfficers.workHistoryList",
                        "agencies.peaceOfficers.workHistoryList.agency"
                    ]
                });

                //if no data found under this state
                if (!dataByState) {
                    res.status(404).send({message: 'Data for this state is on its way. Check back soon!'});
                }
            } catch (err) {
                res.status(500).send({message: 'Internal server error'});
            }

            //get all agencies with officers and workHistory under that state and map to the new data structure that defined at interface.ts
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
                    firstName: officer.firstName,
                    lastName: officer.lastName,
                    workHistory: officer.workHistoryList.filter(history => history.agency.id == agency.id)
                        .map(history => ({
                            id: history.id,
                            startDate: history.startDate,
                            separationDate: history.separationDate,
                            separationReason: history.separationReason,
                        }))
                }))
            }));
            res.status(200).json(result);
        }

        // 2. Filter by agency name
        else if (agencyName) {
            try{
                console.log("------Filter by agency Name-----")
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
                    .leftJoinAndSelect('peaceOfficer.workHistoryList', 'workHistory', 'workHistory.agencyId = :agencyId', {agencyId: agency.id})
                    .leftJoinAndSelect('peaceOfficer.agencies', 'agency')
                    .where('agency.id = :agencyId', {agencyId: agency.id})


                // Apply sorting if sortBy is provided ( sortBy options: "firstName", "lastName", "UID")
                // when sort by UID consider that every state has its own format of UID
                if (sortBy) {
                    if (sortBy === "UID") {
                        console.log("Sort By UID")
                        if (stateCode === "VT") {
                            query = query.orderBy(`CAST(peaceOfficer.${sortBy} AS INTEGER)`, "ASC")
                        }
                        if (stateCode === "WA") {
                            query = query.orderBy(`peaceOfficer.${sortBy}`, "ASC")
                        }
                    } else if (sortBy === "firstName" || "lastName") {
                        console.log("Sort By firstName or lastName")
                        query = query.orderBy(`peaceOfficer.${sortBy}`, "ASC")
                    }
                }
                const peaceOfficers = await query.getMany()
                const responseJson = JSON.stringify(peaceOfficers, null, 2);
                return res.status(200).send(responseJson)

            } catch (err) {
                console.error('Error filtering peace officers:', err);
                res.status(500).send({ message: 'Internal server error' });
            }

            //search by UID, first name or last name
        } else if (UID || firstName || lastName) {
            try{
                console.log("search by------>",UID, firstName, lastName);
                let query= officerDB
                    .createQueryBuilder('peaceOfficer')
                    .leftJoinAndSelect('peaceOfficer.workHistoryList','workHistory')
                    .leftJoinAndSelect('workHistory.agency','workHistoryAgency')
                    .leftJoin('workHistoryAgency.state', 'state')
                    .where('state.stateCode = :stateCode', { stateCode })
                    // .leftJoinAndSelect('peaceOfficer.agencies','agency')
                    if (UID) {
                        query = query.andWhere('peaceOfficer.UID= :UID',{UID})
                    }
                    if (firstName) {
                        query = query.andWhere('peaceOfficer.firstName= :firstName', {firstName})
                    }
                    if (lastName) {
                        query = query.andWhere('peaceOfficer.lastName= :lastName', {lastName})
                    }

                if (sortBy) {
                    if (sortBy === "UID") {
                        console.log("Sort By UID")
                        if (stateCode === "VT") {
                            query = query.orderBy(`CAST(peaceOfficer.${sortBy} AS INTEGER)`, "ASC")
                        }
                        if (stateCode === "WA") {
                            query = query.orderBy(`peaceOfficer.${sortBy}`, "ASC")
                        }
                    } else if (sortBy === "firstName" || "lastName") {
                        console.log("Sort By firstName or lastName")
                        query = query.orderBy(`peaceOfficer.${sortBy}`, "ASC")
                    }
                }
                const peaceOfficers = await query.getMany()
                const responseJson=JSON.stringify(peaceOfficers,null,2);
                return res.status(200).send(responseJson)
        } catch (err) {
                console.error('Error searching:', err);
                res.status(500).send({ message: 'Error searching:', err});
            }
        }
    }
}

export default FilterController;