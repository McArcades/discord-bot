import { Collection } from "discord.js";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENVIRONMENT: string;
            BOT_CLIENT_ID: string;
            BOT_TOKEN: string;
            MONGODB_URI: string;
            PERSPECTIVE_API_TOKEN: string;
        }
    }
}

export {};

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>;
    }
}
