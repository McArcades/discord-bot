import { Client, Events, Message, Role, User } from "discord.js";
import Event from "../../model/event";
import { Db } from "mongodb";
import { getToxicity, punishMessage, ToxicityResult, warnMessage } from "./toxicity.service";
import { hasForbiddenSubject } from "./subject.service";

const TOXICITY_TIMEOUT_DURATION_MS: number = 10 * 60 * 1000;
const FORBIDDEN_SUBJECT_TIMEOUT_DURATION_MS: number = 10 * 60 * 1000;

const onMessage: Event = {
    name: Events.MessageCreate,
    once: false,
    execute: async (client: Client, db: Db, _, message: Message) => {
        if (message.author === client.user) return;

        await toxicityAnalysis(client, message);
        await forbiddenSubject(client, message);
    },
};

async function toxicityAnalysis(client: Client, message: Message): Promise<void> {
    const toxicity: ToxicityResult = await getToxicity(message.content);
    const score: number = Math.max(...Object.values(toxicity));

    if (score > 0.75) {
        await punishMessage(client, message, toxicity);
        await timeoutUser(client, message.author, message.content, TOXICITY_TIMEOUT_DURATION_MS);
    } else if (score > 0.5) {
        await warnMessage(client, message, toxicity);
    }
}

async function forbiddenSubject(client: Client, message: Message): Promise<void> {
    if (await hasForbiddenSubject(message.content)) {
        await message.delete();
        await timeoutUser(client, message.author, message.content, FORBIDDEN_SUBJECT_TIMEOUT_DURATION_MS);
    }
}

async function timeoutUser(client: Client, user: User, message: string, duration: number): Promise<void> {
    const guild = client.guilds.cache.get(process.env.GUILD_ID ?? "");
    if (!guild) return;

    const guildMember = (await guild.members.fetch()).filter((m) => m.user.id === user.id).first();
    if (!guildMember) return;

    const exceptionRoles = (await guild.roles.fetch()).filter((r: Role) =>
        [process.env.ROLE_MODERATOR_ID, process.env.ROLE_ADMINISTRATOR_ID].includes(r.id)
    );

    if (exceptionRoles.some((role) => guildMember.roles.cache.has(role.id))) return;

    try {
        await guildMember.timeout(duration, `Automatic timeout : "${message}".`);
    } catch (error) {
        console.error(`Could not timeout user id ${user.id} for toxicity.\n${error}`);
    }
}

export default onMessage;
