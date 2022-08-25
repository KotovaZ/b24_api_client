import {isJsonString} from "../tools";
import {Iterator} from "../iterator";
import {Request} from "../request";
import {Response, ResponseIterable} from "./responses";

export class ResponseFactory {
    public static create(request: Request, status: number, body: string, error: string = null) {
        try {
            const data = this.getDataByBody(body);
            if (data instanceof Iterator) {
                return new ResponseIterable(request, status, data, error);
            }
            return new Response(status, body, error);
        } catch (e) {
            return new Response(status, body, e.message);
        }
    }

    private static getDataByBody(body: string): any {
        if (!isJsonString(body)) return body;
        return  this.prepareData(JSON.parse(body));
    }

    private static prepareData(body: any): any {
        if (typeof body !== 'object')
            return body;

        if (body.hasOwnProperty('error_description')) {
            throw new Error(body.error_description);
        }

        if (body.hasOwnProperty('total')) {
            return new Iterator(body);
        }
    }
}