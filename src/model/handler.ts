import { Client, Collection } from "discord.js";
import { Db } from "mongodb";
import Command from "./command";
import { Express } from "express";

type Handler = (client: Client, db: Db, commands: Collection<string, Command>, expressApp: Express) => Promise<void> | void;

export default Handler;
