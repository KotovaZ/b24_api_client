import {Request} from "../request";
import {Response} from "node-fetch";
import {IResponse} from "../response/base";
import {BatchResponse} from "./connector";

export type CallApiFn = <T>(method: string, params: T) => Promise<Response>;

export interface IStrategy {
   callMethod: CallApiFn;
   call: (request: Request) => Promise<IResponse>;
   callBatch: (requests: Request[]) => Promise<BatchResponse>;
}
