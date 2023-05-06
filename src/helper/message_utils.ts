import { EmbedBuilder } from "discord.js";

export const UNKNOWN_ERROR_EMBED = new EmbedBuilder()
    .setTitle("Une erreur est survenue")
    .setDescription(
        "Votre requête n'a pas pu aboutir. Veuillez essayer ultérieurement.\nSi le problème persiste, veuillez contacter un administrateur."
    )
    .setColor("#f1c40f");
