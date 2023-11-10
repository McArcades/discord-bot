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
            API_PORT: string;
            GUILD_ID: string;
            ROLE_PLAYER_ID: string;
            ROLE_LINKED_ID: string;
            ROLE_MODERATOR_ID: string;
            CHANNEL_WELCOME_ID: string;
            CHANNEL_STAFF_ALERT_ID: string;
        }
    }
}

export {};

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>;
    }
}
