import * as ua from "universal-analytics";

declare global {
    namespace Express {
        interface Request {
            visitor?: ua.Visitor & { setUid: (uid?: string) => void }
        }
    }
}