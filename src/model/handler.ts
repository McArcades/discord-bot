import { Client, Collection } from "discord.js";
import { Db } from "mongodb";
import Command from "./command";

type Handler = (client: Client, db: Db, commands: Collection<string, Command>) => Promise<void> | void;

export default Handler;
