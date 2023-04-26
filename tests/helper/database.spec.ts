import { Db, MongoClient } from "mongodb";
import { connect } from "../../src/helper/database";

describe("Database helper", () => {
    const mockDb: Db = {} as Db;
    const mockClient = { db: jest.fn().mockReturnValue(mockDb) };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should connect to MongoDB database", async () => {
        // Given
        const uri = "mongodb://localhost:27017/mcarcades-discord-bot";
        const connectSpy = jest.spyOn(MongoClient, "connect").mockResolvedValue(mockClient as any);

        // When
        const db: Db = await connect(uri);

        // Then
        expect(connectSpy).toHaveBeenCalledWith(uri, {});
        expect(mockClient.db).toHaveBeenCalledWith("mcarcades-discord-bot");
        expect(db).toBe(mockDb);
    });
});
