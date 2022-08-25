import {IConfig} from "../connector/config";
import {requestBody} from "../connector/connector";

export abstract class AuthStrategy {
    constructor(protected _config: IConfig) {
    }

    public getConfig(): IConfig{
        return this._config;
    };

    public getMethodPath(method: string): string {
        return `${this._config.getApiPath()}${method}`
    };

    public setAuth(params: requestBody): requestBody {
        return params;
    }
}