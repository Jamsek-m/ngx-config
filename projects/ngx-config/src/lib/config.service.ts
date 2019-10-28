import { Injectable } from "@angular/core";
import { ObjectUtil } from "./object.util";
import { ConfigInitOptions } from "./config.model";

// @dynamic
@Injectable({
    providedIn: "root"
})
export class ConfigService {

    // tslint:disable-next-line:variable-name
    private static _environment: any = null;

    /**
     * Reads configuration from specified path and combines it with values in environment object.
     * @param options Options for configuration service
     */
    public static async initialize<E>(options: ConfigInitOptions<E>): Promise<void> {
        ConfigService._environment = JSON.parse(JSON.stringify(options.environment));

        if (options.configuration) {
            ConfigService.overrideConfig(ConfigService._environment, options.configuration);
        } else if (options.path) {
            try {
                const configuration = await fetch(options.path).then(res => res.json());
                ConfigService.overrideConfig(ConfigService._environment, configuration);
            } catch (err) {
                console.warn("Error fetching configuration file! Using default environment values.");
            }
        } else {
            throw new Error("You need to provide either key 'path' or 'configuration'!");
        }
    }

    /**
     * Returns typed environment object
     */
    public static getConfig<E>(): E {
        return ConfigService._environment;
    }

    /**
     * Returns value from stored configuration.
     * @param key Key in form of "xx.yy.zz" for nested objects.
     */
    public static getValue(key: string): any | null {
        return ConfigService.getValueRecursive(key, ConfigService._environment);
    }

    private static overrideConfig(overrideEnv: any, config: any) {
        for (const key in config) {
            if (key && config.hasOwnProperty(key)) {
                if (config[key]) {
                    if (ObjectUtil.isObject(config[key])) {
                        ConfigService.overrideConfig(overrideEnv[key], config[key]);
                    } else {
                        overrideEnv[key] = config[key];
                    }
                }
            }
        }
    }

    private static getValueRecursive(key: string, data: any): any | null {
        const keyParts = key.split(".");
        if (keyParts.length === 1) {
            if (data[keyParts[0]]) {
                return data[keyParts[0]];
            }
            return null;
        } else {
            if (data[keyParts[0]]) {
                const oldKey = keyParts.shift();
                const newKey = keyParts.join(".");
                return ConfigService.getValueRecursive(newKey, data[oldKey]);
            }
            return null;
        }
    }

}
