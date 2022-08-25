import {object2Url} from "./tools";
import {Connector} from "./connector/connector";

export class Request{
    private _method: string;
    private _params: any;
    private _connector: Connector;
    private _key: string;

    constructor(connector: Connector, key: string = null) {
        this._connector = connector;
        this._key = key;
    }

    public setMethod(method: string): Request {
        this._method = method;
        return this;
    }

    public setParams(params: any): Request {
        this._params = params;
        return this;
    }

    public setParam(key: string, value: any): Request {
        this._params[key] = value;
        return this;
    }

    public getKey(): string {
        return this._key;
    }

    public getParams(): any {
        return this._params;
    }

    public getMethod(): string {
        return this._method;
    }

    public getConnector(): Connector {
        return this._connector;
    }

    public getString(): string {
        let string = this._key ? `cmd[${this._key}]=` : '';
        string += this._method;
        const paramString = object2Url(this._params);
        if (paramString.length) {
            string += encodeURIComponent(`?${paramString}`);
        }
        return string;
    }
}