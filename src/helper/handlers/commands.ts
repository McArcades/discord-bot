import Handler from "../../model/handler";
import { Client, Collection, REST, Routes } from "discord.js";
import { Db } from "mongodb";
import { getFilesRecursive } from "../utils";
import Command from "../../model/command";
import assert from "assert";

const handler: Handler = async (client: Client, db: Db, commands: Collection<string, Command>): Promise<void> => {
    const modulesDir = `${__dirname}/../../modules`;
    const body: any[] = [];

    for (const file of getFilesRecursive(modulesDir)) {
        if (!file.endsWith(".command.ts")) continue;
        const command: Command = (await import(`${file}`)).default;
        commands.set(command.name, command);
        body.push(command.data.toJSON());
    }

    assert(process.env.BOT_TOKEN);
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    try {
        assert(process.env.BOT_CLIENT_ID);
        rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID), { body: body }).then((_) => {});
    } catch (error) {
        console.error(`Could not register commands :\n${error}`);
    }
};

export default handler;
