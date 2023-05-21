import * as app from "../src/app";
import { Db } from "mongodb";
import { connect } from "../src/helper/database";

jest.mock("../src/helper/database", () => ({
    connect: jest.fn().mockResolvedValue({} as Db),
}));

jest.mock("discord.js", () => {
    const originalModule = jest.requireActual("discord.js");

    class MockClient extends originalModule.Client {
        async login(token: string) {
            return Promise.resolve("mocked_token");
        }
    }

    const GatewayIntentBits = originalModule.GatewayIntentBits;

    return {
        ...originalModule,
        Client: MockClient,
        GatewayIntentBits,
    };
});

jest.mock("express", () => {
    return jest.fn(() => ({
        listen: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
    }));
});

describe("App entry point", () => {
    beforeAll(() => {
        jest.spyOn(console, "debug").mockImplementation(() => {
            /* no-op */
        });
        jest.spyOn(console, "info").mockImplementation(() => {
            /* no-op */
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should connect to the database", async () => {
        // Given
        const connectSpy = jest.spyOn({ connect }, "connect");

        // When
        await app.main();

        // Then
        expect(connectSpy).toHaveBeenNthCalledWith(1, process.env.MONGODB_URI);
    });
});
