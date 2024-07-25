import { Request, Response } from "express";
import {myDS} from "../data-source";
import {User} from "../entity/User";
import {validate} from "class-validator";

class UserController {
    static async getAll(req: Request, res: Response) {
        try {
            const userDB = myDS.getRepository(User);
            const users = await userDB.find()
            res.status(200).send(users)
        } catch (error) {
            console.log("Error getting users", error)
            res.status(500).send("Error getting users")
        }
    }

    static async addOne(req: Request, res: Response) {
        // get new user's data from request body
        let newUserData = req.body;
        // verify if request body is empty or invalid data type
        if (!newUserData) {
            return res.status(400).send("Missing Body");
        }


        let userDB = myDS.getRepository(User);
        // Define user
        let user = new User()
        user.firstName = newUserData.firstName
        user.lastName = newUserData.lastName
        user.email = newUserData.email.toLowerCase().trim()

        try {
             //validate user
            let errors = await validate(user)
            if (errors.length > 0) {
                console.log('Validation failed', errors)
                return res.status(400).send(`Error validation failed: ${errors}`)
            }

            //save user to DB
            await userDB.save(user)
            return res.status(200).send(`User added successfully`)

        } catch (error) {
            console.log("Error getting users", error)
            res.status(500).send("Error getting users")
        }
    }
}

export default UserController;