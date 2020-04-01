/**
 * Created by championswimmer on 05/01/17.
 */
import { Request, RequestHandler } from 'express';
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
