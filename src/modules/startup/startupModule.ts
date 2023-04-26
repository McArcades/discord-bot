import { Client } from "discord.js";
import { Db } from "mongodb";
import readyListener from "./readyListener";
import { Module } from "../modules";

const initModule: Module = (client: Client, db: Db) => {
    readyListener(client, db);
};

export default initModule;
