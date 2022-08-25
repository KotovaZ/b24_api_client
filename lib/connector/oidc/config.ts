import {BaseConfig} from "../config";

export type OIDCProps = {
    portal: string;
    access_token?: string;
    refresh_token?: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    expires?: number;
    onTokenUpdate?: (client_id: string, tokenSet: TokenSet) => void
}

export type TokenSet = {
    access_token: string,
    refresh_token: string,
    expires: number
};

export class OIDCConfig extends BaseConfig{
    constructor(protected props: OIDCProps) {
        super();
    }

    public getApiPath(): string {
        return `https://${this.getPortal()}/rest/`;
    }

    public getToken(): {[key: string]: string} {
        return {
            access_token: this.props.access_token,
            refresh_token: this.props.refresh_token,
        }
    }

    public getAppProps(): {[key: string]: string} {
        return {
            client_id: this.props.client_id,
            client_secret: this.props.client_secret,
            redirect_uri: this.props.redirect_uri,
            access_token: this.props.access_token,
            refresh_token: this.props.refresh_token,
        }
    }

    public setToken(tokenSet: TokenSet): void {
        this.props = {...this.props, ...tokenSet};
        const {client_id} = this.props;
        if (this.props.hasOwnProperty('onTokenUpdate')) {
            this.props.onTokenUpdate(client_id, tokenSet);
        }
    }

    public tokenIsActive(): boolean {
        if (!this.props.expires) return false;
        return this.props.expires * 1000 > Date.now();
    }
}
