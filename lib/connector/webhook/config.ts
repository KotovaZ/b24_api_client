import {BaseConfig} from "../config";

export type WebHookProps = {
    portal: string;
    token: string;
    user: number;
}

export class WebHookConfig extends BaseConfig{
    constructor(protected props: WebHookProps) {
        super();
    }

    public getApiPath(): string {
        return `https://${this.getPortal()}/rest/${this.props.user}/${this.props.token}/`;
    }
}