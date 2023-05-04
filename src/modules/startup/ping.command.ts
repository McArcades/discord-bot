import Command from "../../model/command";
import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Db } from "mongodb";

const pingCommand: Command = {
    name: "ping",
    data: new SlashCommandBuilder().setName("ping").setDescription("Test la connexion du bot"),
    execute: async (client: Client, db: Db, interaction: CommandInteraction) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "McArcades" })
                    .setDescription("🏓 Pong !")
                    .setFooter({ text: `RTT = ${interaction.client.ws.ping}ms` })
                    .setColor("#ff8e4d"),
            ],
            ephemeral: true,
        });
    },
};

export default pingCommand;
