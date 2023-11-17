import { Client, Message, User } from "discord.js";
import { sendStaffAlert } from "../../helper/message_utils";

const TOXICITY_TIMEOUT_DURATION_MS = 10 * 60 * 1000;

const ATTRIBUTES: string[] = [
    "TOXICITY",
    "SEVERE_TOXICITY",
    "IDENTITY_ATTACK_EXPERIMENTAL",
    "INSULT_EXPERIMENTAL",
    "PROFANITY_EXPERIMENTAL",
    "THREAT_EXPERIMENTAL",
];

export interface ToxicityResult {
    TOXICITY?: number;
    SEVERE_TOXICITY?: number;
    IDENTITY_ATTACK_EXPERIMENTAL?: number;
    INSULT_EXPERIMENTAL?: number;
    PROFANITY_EXPERIMENTAL?: number;
    THREAT_EXPERIMENTAL?: number;
}

export const getToxicity = async (content: string): Promise<ToxicityResult> => {
    const Perspective = require("perspective-api-client");
    const perspective = new Perspective({
        apiKey: process.env.PERSPECTIVE_API_TOKEN,
    });

    let response: any = null;
    try {
        response = await perspective.analyze(content, {
            attributes: ATTRIBUTES,
            doNotStore: true,
            languages: ["fr"],
        });
    } catch (err) {
        console.error("Error during message analysis request : ", err);
    }
    if (!response) return {};

    return Object.keys(response.attributeScores).reduce((output, keyStr) => {
        const key = keyStr as keyof ToxicityResult;
        output[key] = response.attributeScores[keyStr].summaryScore.value;
        return output;
    }, {} as ToxicityResult);
};

export const punishMessage = async (client: Client, message: Message, toxicity: ToxicityResult): Promise<void> => {
    await message.delete();
    await sendStaffAlert(
        client,
        process.env.ROLE_MODERATOR_ID ?? null,
        "Message toxique supprimé",
        `Le message de ${message.author.username} (${message.author.id}) a été supprimé pour toxicité.\n` +
            `"*${message.content}*"\n\n` +
            `||\`${JSON.stringify(toxicity)}\`||`
    );
};

export const warnMessage = async (client: Client, message: Message, toxicity: ToxicityResult): Promise<void> => {
    await sendStaffAlert(
        client,
        process.env.ROLE_MODERATOR_ID ?? null,
        "Message suspect",
        `Le message de ${message.author.username} (${message.author.id}) semble toxique.\n` +
            `"*${message.content}*"\n\n` +
            `||\`${JSON.stringify(toxicity)}\`||`
    );
};

export const timeoutUser = async (client: Client, user: User, message: string): Promise<void> => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID ?? "");
    if (!guild) return;

    const guildMember = (await guild.members.fetch()).filter((m) => m.user.id === user.id).first();
    if (!guildMember) return;

    await guildMember.timeout(TOXICITY_TIMEOUT_DURATION_MS, `Automatic timeout for toxicity : "${message}".`);
};
