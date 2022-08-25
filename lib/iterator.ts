export type IterableObject = {
    total: number,
    next?: number,
    result: Array<any>
}

export class Iterator {
    private _data: IterableObject;
    private _index: number = -1;

    constructor(data: IterableObject) {
        this._data = data;
    }

    public current(): any  {
        return this._index >= 0 ? this._data['result'][this._index] : null;
    }

    public next(): any {
        if (this.isDone()) return;
        this._index += 1;
        return this.current();
    }

    public getBody(): any {
        return this._data;
    }

    public isDone(): boolean {
        return this._index === this._data.result.length - 1;
    }
}