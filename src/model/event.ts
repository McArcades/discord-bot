import { Db } from "mongodb";
import { Client, Collection } from "discord.js";
import Command from "./command";

interface Event {
    name: string;
    once?: boolean;
    execute: (client: Client, db: Db, commands: Collection<string, Command>, ...args: any[]) => Promise<void> | void;
}

export default Event;
