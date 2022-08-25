export interface IResponse {
    isSuccess(): boolean;
    getError(): string;
    getData(): any;
    hasNextPage?: () => boolean
}

export class ResponseBase implements IResponse{
    protected _status: number;
    protected _data: any;
    protected _error: string;

    public isSuccess() {
        return this._status === 200 && !!this._error;
    }

    public getData() {
        return this._data;
    }

    public getError() {
        return this._error;
    }
}