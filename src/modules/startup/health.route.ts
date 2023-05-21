import Route from "../../model/route";
import { Client } from "discord.js";
import { Db } from "mongodb";
import { Express, Request, Response } from "express";

const route: Route = (client: Client, db: Db, expressApp: Express) => {
    expressApp.get("/", (req: Request, res: Response) => {
        res.status(200).send("McArcades Discord Bot API");
    });

    expressApp.get("/health", (req: Request, res: Response) => {
        if (client.isReady() && db.databaseName) {
            res.status(200).send("OK");
        } else {
            res.status(500).send("KO");
        }
    });
};

export default route;
