import {AuthStrategy} from "../../auth/strategy";
import {WebHookConfig, WebHookProps} from "./config";

export class WebHookStrategy extends AuthStrategy {
    constructor(config: WebHookProps) {
        super(new WebHookConfig(config));
    }
}
