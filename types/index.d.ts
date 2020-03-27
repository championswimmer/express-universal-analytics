/**
 * Created by championswimmer on 05/01/17.
 */
import { Request, RequestHandler } from 'express';
import * as ua from 'universal-analytics';
declare module 'express' {
    interface Request {
        visitor: ua.Visitor & {
            setUid(uid?: string): void;
        };
        session: any;
    }
}
export interface ReqToUserId {
    (req: Request): string;
}
interface ExpressGAParams {
    uaCode: string;
    cookieName?: string;
    reqToUserId?: ReqToUserId;
    autoTrackPages?: boolean;
}
declare function ExpressGA(uaCode: string): RequestHandler;
declare function ExpressGA(params: ExpressGAParams): RequestHandler;
export default ExpressGA;
