import { Client, Events, Message } from "discord.js";
import Event from "../../model/event";
import { Db } from "mongodb";
import { getToxicity, punishMessage, ToxicityResult, warnMessage } from "./toxicity.service";

const onMessage: Event = {
    name: Events.MessageCreate,
    once: false,
    execute: async (client: Client, db: Db, _, message: Message) => {
        if (message.author === client.user) return;

        const toxicity: ToxicityResult = await getToxicity(message.content);
        const score: number = Math.max(...Object.values(toxicity));

        if (score > 0.75) {
            await punishMessage(client, message, toxicity);
        } else if (score > 0.5) {
            await warnMessage(client, message, toxicity);
        }
    },
};

export default onMessage;
