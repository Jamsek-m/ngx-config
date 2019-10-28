import { ConfigService } from "./config.service";

const environment = {
    production: true,
    apiUrl: "http://localhost:8080/v1",
    auth: {
        oidc: {
            tokenEndpoint: "http://auth.server.com/token",
            userInfoEndpoint: "http://auth.server.com/userinfo",
            clientId: "sample-resource"
        }
    }
};

const configuration = {
    apiUrl: "http://api.server.com/v3",
    auth: {
        oidc: {
            clientId: "prod-resource"
        }
    }
};

describe("ConfigService", () => {

    it("should return environment", async () => {

        await ConfigService.initialize({configuration: {}, environment});

        expect(ConfigService.getConfig()).toEqual(environment);

    });

    it("should read values from passed environment", async () => {

        await ConfigService.initialize({configuration: {}, environment});

        const clientId = ConfigService.getValue("auth.oidc.clientId");
        expect(clientId).toEqual(environment.auth.oidc.clientId);

    });

    it("should perform value override", async () => {

        await ConfigService.initialize({configuration, environment});

        const clientId = ConfigService.getValue("auth.oidc.clientId");
        expect(clientId).toEqual(configuration.auth.oidc.clientId);

    });
});
