import { Request, Response } from 'express';
import { myDS } from '../data-source';
import { User } from '../entity/User';
import fs from 'fs';
import csvParser from 'csv-parser';
import {parse} from '@fast-csv/parse';



class FileController {
    // Existing methods...

    static async uploadCSV(req: Request, res: Response) {
        
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const filePath = req.file.path;
        console.log("File Path--->", filePath);
        // const userDB = myDS.getRepository(User);
        const maxRows = 5; //number of rows to read at a time
        let rowCount = 0;
        const results: any[] = [];

        const stream = fs.createReadStream(filePath)
            .pipe(parse({headers:true}))
            .on('data', (row) => {
                // console.log("row--->", row);
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
}

export default FileController;