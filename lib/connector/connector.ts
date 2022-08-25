import {IResponse} from "../response/base";
import {AuthStrategy} from "../auth/strategy";
import {ResponseFactory} from "../response/factory";
import {Request} from "../request";
import fetch, {Response} from "node-fetch";

export type BatchResponse = {
    [key: string]: IResponse
}

export type requestBody = {[key: string]: any} | string;

export class Connector {
    constructor(private strategy: AuthStrategy) {
    }

    public setStrategy(strategy: AuthStrategy) {
        this.strategy = strategy;
    }

    public async callMethod(method: string, params: requestBody): Promise<Response> {
        params = await this.strategy.setAuth(params);
        const isJSON = typeof params === 'object';
        const url = this.strategy.getMethodPath(method);
        const body = isJSON ? JSON.stringify(params) : params.toString();

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': isJSON ? 'application/json'  : 'application/x-www-form-urlencoded'
            },
            body
        });
    }

    public async call(request: Request): Promise<IResponse> {
        const res = await this.callMethod(request.getMethod(), request.getParams());
        const bodyText = await res.text();
        const errorText = res.status !== 200 ? res.statusText : null;
        return ResponseFactory.create(request, res.status, bodyText, errorText);
    }

    public async callBatch(requests: Request[]): Promise<BatchResponse> {
        const result: BatchResponse = {};
        const requestBody = requests
            .map(request => request.getString())
            .join('&')

        const res = await this.callMethod('batch', requestBody);
        const responseBody = await res.json();
        if (res.status !== 200) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        requests.forEach((request: Request) => {
            const key = request.getKey();
            const isSuccess = responseBody.result.result.hasOwnProperty(key);
            const errorText = !isSuccess ? responseBody.result.result_error[key].error_description : null;
            const responseData = this.getBatchPartBody(responseBody, key);
            result[key] = ResponseFactory.create(request, res.status, responseData, errorText);
        })

        return result;
    }

    private getBatchPartBody(response: any, requestKey: string): string {
        const responseData: {[key: string]: any} = {
            result: response.result.result[requestKey],
            error: response.result.result_error[requestKey]
        }

        if (response.result.result_total.hasOwnProperty(requestKey)) {
            responseData.total = response.result.result_total[requestKey];
        }
        if (response.result.result_next.hasOwnProperty(requestKey)) {
            responseData.next = response.result.result_next[requestKey];
        }
        return JSON.stringify(responseData);
    }
}
