import * as dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { connect } from "./helper/database";
import { Db } from "mongodb";
import { MODULES } from "./modules/modules";

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
    return await connect(process.env.MONGODB_URI);
}

async function initModules(client: Client, db: Db): Promise<void> {
    MODULES.forEach((module) => module(client, db));
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
    await initModules(client, db);

    // client auth
    await client.login(process.env.BOT_TOKEN);
}

main().then(() => {
    console.info("App started.");
});
