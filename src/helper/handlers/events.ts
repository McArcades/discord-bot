import { Client, Collection } from "discord.js";
import Event from "../../model/event";
import { Db } from "mongodb";
import Handler from "../../model/handler";
import { getFilesRecursive } from "../utils";
import Command from "../../model/command";

const handler: Handler = (client: Client, db: Db, commands: Collection<string, Command>): void => {
    const modulesDir = `${__dirname}/../../modules`;

    getFilesRecursive(modulesDir).forEach(async (file: string) => {
        if (!file.endsWith(".event.ts")) return;

        const event: Event = (await import(`${file}`)).default;

        event.once
            ? client.once(event.name, (...args) => event.execute(client, db, commands, ...args))
            : client.on(event.name, (...args) => event.execute(client, db, commands, ...args));
    });
};

export default handler;
