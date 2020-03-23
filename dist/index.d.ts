/**
 * Created by championswimmer on 05/01/17.
 */
import { Request, RequestHandler } from 'express-serve-static-core';
import { Visitor } from 'universal-analytics';
declare module 'express-serve-static-core' {
    interface Request {
        visitor: Visitor;
    }
}
export interface ReqToUserId {
    (req: Request): string;
}
declare function ExpressGA(uaCode: string, cookieName?: string, reqToUserId?: ReqToUserId): RequestHandler;
export default ExpressGA;
