import { Client, Events } from "discord.js";
import Event from "../../model/event";
import { Db } from "mongodb";

const onReady: Event = {
    name: Events.ClientReady,
    once: false,
    execute: (client: Client, db: Db) => {
        console.debug(`Connected as ${client.user?.tag}`);
    },
};

export default onReady;
