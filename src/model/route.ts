import { Express } from "express";
import { Client } from "discord.js";
import { Db } from "mongodb";

type Route = (client: Client, db: Db, expressApp: Express) => void;

export default Route;
