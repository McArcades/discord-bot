import Event from "../../model/event";
import { Client, Events, GuildMember, User } from "discord.js";
import { Db } from "mongodb";
import * as fs from "fs";
import { createCanvas, loadImage } from "canvas";
import sharp from "sharp";
import axios from "axios";

async function createWelcomeImage(member: User): Promise<string> {
    // Creating canvas
    const outPath = "./tmp/bienvenue.png";
    const width = 1024,
        height = 500;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background image
    const bgPath = "./src/assets/images/welcome/";
    const files = fs.readdirSync(bgPath);
    const background = await loadImage(`${bgPath}${files[Math.floor(Math.random() * files.length)]}`);
    ctx.drawImage(background, 0, 0, width, height);

    // Adding title
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = "bold 48pt Lato";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("BIENVENUE", width / 2, 0.8 * height);

    // Adding subtitle
    ctx.font = "bold 26pt Lato";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(member.username, width / 2, 0.88 * height);

    // Adding avatar
    // Avatar : outer circle
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2.75, 136, 0, 2 * Math.PI);
    ctx.fill();
    // Avatar : inner circle containing the avatar
    ctx.fillStyle = "#fff";
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2.75, 128, 0, 2 * Math.PI);
    ctx.closePath();
    // Avatar : drawing image inside inner circle
    ctx.clip();
    const avatarUri = member.avatarURL();
    if (avatarUri != null) {
        const imageResponse = await axios.get(avatarUri, {
            responseType: "arraybuffer",
        });
        const avatarBuffer = await sharp(imageResponse.data).toFormat("png").toBuffer();
        const avatar = await loadImage(avatarBuffer);

        ctx.drawImage(avatar, width / 2 - 256 / 2, height / 2.75 - 256 / 2, 256, 256);
    }
    ctx.restore();

    // Saving image
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outPath, buffer);

    return outPath;
}

const onJoin: Event = {
    name: Events.GuildMemberAdd,
    once: false,
    execute: async (client: Client, db: Db, _, member: GuildMember) => {
        if (!member) return;

        const guild = client.guilds.cache.get(process.env.GUILD_ID || "");
        if (!guild) return;

        const channel = guild.channels.cache.get(process.env.CHANNEL_WELCOME_ID || "");
        if (!channel || !channel.isTextBased()) return;

        // Player role
        const role = guild.roles.cache.find((role) => role.id === process.env.ROLE_PLAYER_ID || "");
        if (role) await member.roles.add(role);

        // Welcome image
        await channel.send({ files: [await createWelcomeImage(member.user)] });
    },
};

export default onJoin;
