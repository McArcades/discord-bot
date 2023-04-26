import { Db, MongoClient } from "mongodb";

export async function connect(uri: string): Promise<Db> {
    const client = await MongoClient.connect(uri, {});
    return client.db(uri.split("/")[uri.split("/").length - 1]);
}
