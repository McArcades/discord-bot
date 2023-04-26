import { Client } from "discord.js";
import { Db } from "mongodb";
import startupModule from "./startup/startupModule";

export type Module = (client: Client, db: Db) => void;
export type EventListener = (client: Client, db: Db) => void;

export const MODULES: Module[] = [startupModule];
