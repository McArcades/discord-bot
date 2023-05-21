import { Client, Collection } from "discord.js";
import { Db } from "mongodb";
import { getFilesRecursive } from "../../../src/helper/utils";
import handler from "../../../src/helper/handlers/events";
import Command from "../../../src/model/command";
import express from "express";

jest.mock("../../../src/helper/utils", () => ({
    getFilesRecursive: jest.fn(() => ["/path/to/file1.ts", "/path/to/file2.ts"]),
}));

describe("Handler", () => {
    let client: Client;
    let db: Db;
    let commands: Collection<string, Command>;

    beforeEach(() => {
        client = new Client({ intents: [] });
        db = {} as Db;
        commands = new Collection<string, Command>();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should only register command files", async () => {
        const clientOnSpy = jest.spyOn(client, "on");

        await handler(client, db, commands, express());

        expect(getFilesRecursive).toHaveBeenCalledWith(`${__dirname}/../../modules`.replace("tests", "src"));
        expect(clientOnSpy).toHaveBeenCalledTimes(0);
    });
});
