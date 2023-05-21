import Handler from "../../model/handler";
import { Client } from "discord.js";
import { Db } from "mongodb";
import { getFilesRecursive } from "../utils";
import Route from "../../model/route";
import { Express } from "express";

const handler: Handler = async (client: Client, db: Db, _, expressApp: Express): Promise<void> => {
    const modulesDir = `${__dirname}/../../modules`;
    const body: any[] = [];

    for (const file of getFilesRecursive(modulesDir)) {
        if (!file.endsWith(".route.ts")) continue;

        const route: Route = (await import(`${file}`)).default;
        route(client, db, expressApp);
    }
};

export default handler;
