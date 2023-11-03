import Command from "../../model/command";
import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Db } from "mongodb";
import { addToBeta, fetchFromDiscordID } from "../../model/entities/member";

const betaCommand: Command = {
    name: "beta",
    data: new SlashCommandBuilder().setName("beta").setDescription("S'abonner au programme Bêta de McArcades"),
    execute: async (client: Client, db: Db, interaction: CommandInteraction) => {
        const discordId: string = interaction.user.id;
        const member = await fetchFromDiscordID(discordId, db);
        if (member?.discordID && member?.minecraftUUID) {
            if (!member.betaAccess) {
                await addToBeta(member, db);
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Félicitations !")
                            .setDescription("Tu es désormais dans le programme Bêta !")
                            .setColor("#2ecc71"),
                    ],
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Déjà inscrit")
                            .setDescription("Tu es déjà inscrit dans le programme Bêta.")
                            .setColor("#f1c40f"),
                    ],
                    ephemeral: true,
                });
            }
        } else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Ton compte n'est pas lié !")
                        .setDescription("Ton compte Discord doit être lié à ton compte Minecraft.\nUtilise la commande `/link`.")
                        .setColor("#f1c40f"),
                ],
                ephemeral: true,
            });
        }
    },
};

export default betaCommand;
