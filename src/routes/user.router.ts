import * as express from "express";
import { ObjectId, Document } from "mongodb";
import { collections } from "../services/db.service";
import { newUser, user } from "../models/user";

export const userRouter = express.Router();

userRouter.use(express.json());

userRouter.get("/api/users", async (_req: express.Request, res: express.Response) => {
    try {
       const users = (await collections.users!.find({}).toArray()) as unknown as user[];

        res.status(200).send(users);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

userRouter.get("/api/users/:id", async (req: express.Request, res: express.Response) => {
    const id = req?.params?.id.toLowerCase();

    try {
        
        const query = { username: id };
        const user = (await collections.users!.findOne(query)) as unknown as user;

        if (user) {
            res.status(200).send(user);
        }else{
            res.status(404).send(`Unable to find matching document with name: ${req.params.id}`);
        };
    }
    catch{
        res.status(500).send('Error connecting to database.');
    };
});

userRouter.post("/api/users", async (req: express.Request, res: express.Response) => {
    try {
        const newUser = req.body as newUser;
        const result = await collections.users!.insertOne(newUser);

        result
            ? res.status(201).send(result)
            : res.status(500).send("Failed to create a new user.");
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

userRouter.put("/api/users/:id", async (req: express.Request, res: express.Response) => {
    const id = req?.params?.id.toLowerCase();

    try {
        const updatedUser: user = req.body as user;
        const query = { username: id };
      
        const result = await collections.users!.updateOne(query, { $set: updatedUser });

        result
            ? res.status(200).send(`Successfully updated user with name ${id}`)
            : res.status(304).send(`User with name: ${id} not updated`);
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

userRouter.delete("/api/users/:id", async (req: express.Request, res: express.Response) => {
    const id = req?.params?.id.toLowerCase();

    try {
        const query = { username: id };
        const result = await collections.users!.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed user with name: ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove user with name: ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`User with name: ${id} does not exist`);
        }
    } catch (error: any) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});