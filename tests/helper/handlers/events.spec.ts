import { Client, Collection, REST } from "discord.js";
import { Db } from "mongodb";
import { getFilesRecursive } from "../../../src/helper/utils";
import handler from "../../../src/helper/handlers/events";
import Command from "../../../src/model/command";

jest.mock("../../../src/helper/utils", () => ({
    getFilesRecursive: jest.fn(() => ["/path/to/file1.ts", "/path/to/file2.ts"]),
}));

describe("Handler", () => {
    let client: Client;
    let db: Db;

    beforeEach(() => {
        client = new Client({ intents: [] });
        db = {} as Db;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should only register event listener files", async () => {
        const clientOnSpy = jest.spyOn(client, "on");
        const restPutMock = jest.fn().mockResolvedValueOnce({});
        jest.spyOn(REST.prototype, "put").mockImplementationOnce(restPutMock);

        await handler(client, db, new Collection<string, Command>());

        expect(getFilesRecursive).toHaveBeenCalledWith(`${__dirname}/../../modules`.replace("tests", "src"));
        expect(clientOnSpy).toHaveBeenCalledTimes(0);
    });
});
