import Command from "../../model/command";
import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Db } from "mongodb";
import { fetchFromDiscordID, getTagHash } from "../../model/entities/member";

const linkCommand: Command = {
    name: "link",
    data: new SlashCommandBuilder().setName("link").setDescription("Lie ton compte Minecraft à ton compte Discord"),
    execute: async (client: Client, db: Db, interaction: CommandInteraction) => {
        const discordId: string = interaction.user.id;
        const member = await fetchFromDiscordID(discordId, db);
        if (member?.discordID && member?.minecraftUUID) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Compte déjà lié")
                        .setDescription("Ton compte Discord est déjà lié à un compte Minecraft.")
                        .setColor("#f1c40f"),
                ],
                ephemeral: true,
            });
        } else {
            const tag = `${interaction.user.username}#${interaction.user.discriminator}`;
            const salt: string = getTagHash(tag).substring(0, 8);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#9b59b6")
                        .setTitle("Connexion au compte Minecraft")
                        .setDescription(
                            "Pour lier ton compte Minecraft avec ton compte Discord, connectes-toi sur le serveur et tapes la commande :\n" +
                                `\`/discord ${tag} ${salt}\``
                        )
                        .setFooter({ text: "Récompense : 5000 Jetons et 5000 XP" }),
                ],
            });
        }
    },
};

export default linkCommand;
