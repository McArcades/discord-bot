const originalModule = jest.requireActual("discord.js");

class MockClient extends originalModule.Client {
    async login(token: string) {
        return Promise.resolve("mocked_token");
    }
}

const GatewayIntentBits = originalModule.GatewayIntentBits;

export default {
    ...originalModule,
    Client: MockClient,
    GatewayIntentBits,
};
