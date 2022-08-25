import {AuthStrategy} from "../../auth/strategy";
import {OIDCConfig, OIDCProps, TokenSet} from "./config";
import {requestBody} from "../connector";
import {object2Url} from "../../tools";
import fetch from "node-fetch";

export class OIDCStrategy extends AuthStrategy{
    protected _config: OIDCConfig;
    constructor(config: OIDCProps) {
        super(new OIDCConfig(config));
    }

    public async setAuth(params: requestBody): Promise<requestBody> {
        if (!this._config.tokenIsActive()) {
            await this.refreshToken();
        }
        const {access_token} = this._config.getToken();
        switch (typeof params) {
            case 'object':
                params.auth = access_token;
                break;
            default:
                params += `&auth=${access_token}`;
                break;
        }
        return params;
    }

    private async refreshToken(): Promise<void> {
        const requestPath = `https://${this._config.getPortal()}/oauth/token/`;
        const requestParams = {...this._config.getAppProps(), grant_type: "refresh_token"};
        const path = `${requestPath}?${object2Url(requestParams)}`;

        const tokenRes = await fetch(path);
        if (tokenRes.status !== 200) {
            throw new Error(`${tokenRes.status} ${tokenRes.statusText}`);
        }

        const {access_token, refresh_token, expires, error} = await tokenRes.json();
        if (error) {
            throw new Error(`${error}`);
        }

        const tokenSet: TokenSet = {access_token, refresh_token, expires};
        this._config.setToken(tokenSet);
        return;
    }
}
