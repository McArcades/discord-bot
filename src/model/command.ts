import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Db } from "mongodb";

interface Command {
    name: string;
    data: SlashCommandBuilder | any;
    execute: (client: Client, db: Db, interaction: CommandInteraction) => Promise<void> | void;
}

export default Command;
