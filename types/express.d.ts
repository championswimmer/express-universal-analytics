import * as ua from "universal-analytics";

declare module 'express-serve-static-core' {
    interface Request {
        visitor: ua.Visitor & { setUid: (uid?: string) => void }
    }
}
