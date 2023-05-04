import { Client, Collection, Events, Interaction } from "discord.js";
import Event from "../../model/event";
import { Db } from "mongodb";
import Command from "../../model/command";

const onInteraction: Event = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (client: Client, db: Db, commands: Collection<string, Command>, interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(client, db, interaction);
    },
};

export default onInteraction;
