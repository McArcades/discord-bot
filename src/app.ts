import * as dotenv from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { connect } from "./helper/database";
import { Db } from "mongodb";
import assert from "assert";
import { getFilesRecursive } from "./helper/utils";
import Command from "./model/command";

async function initDiscordClient(): Promise<Client> {
    return new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
        ],
    });
}

async function initDatabaseClient(): Promise<Db> {
    assert(process.env.MONGODB_URI);
    return await connect(process.env.MONGODB_URI);
}

async function initModules(client: Client, db: Db, commands: Collection<string, Command>): Promise<void> {
    const handlersDir = `${__dirname}/helper/handlers`;

    for (const file of getFilesRecursive(handlersDir)) (await import(`${file}`)).default(client, db, commands);
}

export async function main() {
    // init environment
    dotenv.config();

    // init bot client
    console.debug("Initializing Discord client...");
    const client: Client = await initDiscordClient();

    // init database connection
    console.debug("Initializing MongoDB client...");
    const db: Db = await initDatabaseClient();

    // init bot modules
    console.debug("Initializing modules...");
    const commands = new Collection<string, Command>();
    await initModules(client, db, commands);

    // client auth
    await client.login(process.env.BOT_TOKEN);
}

main().then(() => {
    console.info("App started.");
});
