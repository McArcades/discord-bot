import { Collection } from "discord.js";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENVIRONMENT: string;
            BOT_CLIENT_ID: string;
            BOT_TOKEN: string;
            MONGODB_URI: string;
            PERSPECTIVE_API_TOKEN: string;
            TAG_SALT: string;
            DATABASE_PREFIX: string;
            GUILD_ID: string;
            ROLE_LINKED_ID: string;
            API_PORT: string;
        }
    }
}

export {};

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>;
    }
}
