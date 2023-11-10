import { Client, EmbedBuilder, TextChannel } from "discord.js";

export const UNKNOWN_ERROR_EMBED = new EmbedBuilder()
    .setTitle("Une erreur est survenue")
    .setDescription(
        "Votre requête n'a pas pu aboutir. Veuillez essayer ultérieurement.\nSi le problème persiste, veuillez contacter un administrateur."
    )
    .setColor("#f1c40f");

export const sendStaffAlert = async (client: Client, targetGroupId: string | null, title: string, message: string): Promise<void> => {
    if (!client) return;

    const guild = client.guilds.cache.get(process.env.GUILD_ID ?? "");
    if (!guild) return;

    const channel = guild.channels.cache.get(process.env.CHANNEL_STAFF_ALERT_ID ?? "");
    if (!channel?.isTextBased) return;

    let description: string = message;
    if (targetGroupId !== null) {
        description += `\n\n<@&${targetGroupId}>`;
    }

    await (channel as TextChannel).send({
        embeds: [new EmbedBuilder().setColor("#e67e22").setTitle(title).setDescription(description)],
    });
};
