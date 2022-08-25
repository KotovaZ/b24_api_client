import {Request} from "./request";
import {BatchResponse, Connector} from "./connector/connector";
import {AuthStrategy} from "./auth/strategy";

type BatchParams = {
    method: string,
    params: any
}

type BatchCollection = {
    [key: string]: BatchParams
}

export class B24 {
    private _connector: Connector
    constructor(strategy: AuthStrategy) {
        this._connector = new Connector(strategy);
    }

    public setStrategy(strategy: AuthStrategy): void {
        this._connector.setStrategy(strategy);
    }

    public async callMethod<T>(method: string, params: T): Promise<any> {
        const request = new Request(this._connector)
            .setMethod(method)
            .setParams(params);
        return await this._connector.call(request);
    }

    public async callBatch(params: BatchCollection): Promise<BatchResponse> {
        const requests: Request[] = [];
        for (const [key, item] of Object.entries(params)) {
            const request = new Request(this._connector, key)
                .setMethod(item.method)
                .setParams(item.params);
            requests.push(request);
        }

        return await this._connector.callBatch(requests);
    }
}