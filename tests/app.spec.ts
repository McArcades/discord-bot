import * as app from "../src/app";
import { Db } from "mongodb";

describe("App entry point", () => {
    beforeAll(() => {
        jest.mock("dotenv", () => ({
            config: jest.fn(),
        }));
        jest.mock("../src/helper/database", () => ({
            connect: jest.fn().mockResolvedValue({} as Db),
        }));
        jest.mock("../src/modules/modules", () => ({
            MODULES: [
                () => {
                    /* no-op */
                },
            ],
        }));

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

    it("should start the application", async () => {
        // When
        await app.main();

        // Then
        expect(console.debug).toHaveBeenCalled();
        expect(console.info).toHaveBeenNthCalledWith(1, "App started.");
    });
});
