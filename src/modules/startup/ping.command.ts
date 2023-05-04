import Command from "../../model/command";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const pingCommand: Command = {
    name: "ping",
    data: new SlashCommandBuilder().setName("ping").setDescription("Test la connexion du bot"),
    execute: async (interaction) => {
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
