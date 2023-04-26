import { Client, Events } from "discord.js";
import { EventListener } from "../modules";

const registerListener: EventListener = (client: Client) => {
    client.once(Events.ClientReady, () => {
        console.debug(`Connected as ${client.user?.tag}`);
    });
};

export default registerListener;
