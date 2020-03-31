import * as ua from "universal-analytics";

declare module 'express' {
    export interface Request {
        visitor?: ua.Visitor & { setUid: (uid?: string) => void }
    }
}
