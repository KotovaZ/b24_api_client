import {IResponse, ResponseBase} from "./base";
import {Request} from "../request";
import {Iterator} from "../iterator";

export class Response extends ResponseBase {
    constructor(status: number, data: any, error: string = null) {
        super();
        this._status = status;
        this._error = error;
        this._data = data;
    }
}

export class ResponseIterable extends ResponseBase {
    private _request: Request;

    constructor(request: Request, status: number, data: Iterator, error: string = null) {
        super();
        this._status = status;
        this._error = error;
        this._data = data;
        this._request = request;
    }

    public async nextPage(): Promise<IResponse> {
        const body = this._data.getBody();
        if (!body.hasOwnProperty('next')) {
            return null;
        }
        this._request.setParam('start', body.next);
        return await this._request.getConnector().call(this._request);
    }

    public hasNextPage() {
        return this._data.getBody().hasOwnProperty('next');
    }
}