import { Db } from "mongodb";
import CryptoJS from "crypto-js";

const COLLECTION_NAME = "discordprofiles";

export interface Member {
    discordID: string;
    minecraftUUID?: string;
    betaAccess: boolean;
}

export async function fetchFromUUID(minecraftUUID: string, db: Db): Promise<Member | null> {
    return mapToMember(await db.collection(`${process.env.DATABASE_PREFIX}${COLLECTION_NAME}`).findOne({ UUID: minecraftUUID }));
}

export async function fetchFromDiscordID(discordID: string, db: Db): Promise<Member | null> {
    return mapToMember(await db.collection(`${process.env.DATABASE_PREFIX}${COLLECTION_NAME}`).findOne({ DiscordID: discordID }));
}

export async function linkMinecraftAccount(discordID: string, uuid: string, db: Db): Promise<void> {
    const res = await db
        .collection(`${process.env.DATABASE_PREFIX}${COLLECTION_NAME}`)
        .findOne({ $or: [{ DiscordID: discordID }, { UUID: uuid }] });
    if (!res) {
        await db
            .collection(`${process.env.DATABASE_PREFIX}${COLLECTION_NAME}`)
            .insertOne({ DiscordID: discordID, UUID: uuid, PrivateBetaAccess: false });
    } else {
        await db
            .collection(`${process.env.DATABASE_PREFIX}${COLLECTION_NAME}`)
            .updateOne({ DiscordID: discordID }, { $set: { UUID: uuid } });
        await db
            .collection(`${process.env.DATABASE_PREFIX}${COLLECTION_NAME}`)
            .updateOne({ UUID: uuid }, { $set: { DiscordID: discordID } });
    }
}

export async function addToBeta(member: Member, db: Db) {
    await db
        .collection(`${process.env.DATABASE_PREFIX}${COLLECTION_NAME}`)
        .updateOne({ DiscordID: member.discordID }, { $set: { PrivateBetaAccess: true } });
}

function mapToMember(dbResult: any): Member | null {
    if (!dbResult) return null;
    return {
        discordID: dbResult.DiscordID,
        minecraftUUID: dbResult.UUID,
        betaAccess: dbResult.PrivateBetaAccess,
    };
}

export function getTagHash(tag: string): string {
    return CryptoJS.SHA256(tag + process.env.TAG_SALT)
        .toString(CryptoJS.enc.Base64)
        .replace(/\//g, "-")
        .replace(/\+/g, "_");
}
