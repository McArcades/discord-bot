import Route from "../../model/route";
import { Client, EmbedBuilder } from "discord.js";
import { Db } from "mongodb";
import { Express, Request, Response } from "express";
import { fetchFromDiscordID, getTagHash, linkMinecraftAccount } from "../../model/entities/member";

const route: Route = (client: Client, db: Db, expressApp: Express) => {
    expressApp.get("/link-account/:tag/:hash/:uuid", async (req: Request, res: Response) => {
        const tag = req.params.tag.replace("@", "#"),
            hash = req.params.hash,
            uuid = req.params.uuid;

        if (getTagHash(tag).substring(0, 8) != hash) {
            res.status(403).send("Invalid hash.");
            return;
        }

        const guild = client.guilds.cache.get(process.env.GUILD_ID ?? "");
        if (!guild) {
            res.status(500).send("Could not fetch guild.");
            return;
        }

        const guildMember = (await guild.members.fetch()).filter((m) => m.user.tag === tag).first();
        if (!guildMember) {
            res.status(400).send("Member is not in the guild.");
            return;
        }

        const member = await fetchFromDiscordID(guildMember.user.id, db);

        if (member?.minecraftUUID) {
            res.status(400).send("Discord account already linked.");
            return;
        }

        await linkMinecraftAccount(guildMember.user.id, uuid, db);
        const role = (await guild.roles.fetch()).filter((r) => r.id === process.env.ROLE_LINKED_ID).first();
        if (role) await guildMember.roles.add(role);
        else console.error("Could not assign LINKED role to " + tag);

        const dm = await guildMember.createDM();
        await dm.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("#2ecc71")
                    .setTitle("Compte minecraft lié !")
                    .setDescription("Votre compte minecraft a bien été lié à votre compte discord."),
            ],
        });

        res.status(200).send("User linked successfully.");
    });
};

export default route;
