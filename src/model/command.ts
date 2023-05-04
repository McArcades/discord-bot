import { CommandInteraction, SlashCommandBuilder } from "discord.js";

interface Command {
    name: string;
    data: SlashCommandBuilder | any;
    execute: (interaction: CommandInteraction) => Promise<void> | void;
}

export default Command;
