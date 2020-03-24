"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ua = require("universal-analytics");
function ExpressGA(uaCode, cookieName, reqToUserId) {
    let middlewareOpts = { cookieName: cookieName || '_ga' };
    let middleware = ua.middleware(uaCode, middlewareOpts);
    function middlewareWrapper(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            middleware(req, res, next);
            if (!req.headers['x-forwarded-for']) {
                req.headers['x-forwarded-for'] = '0.0.0.0';
            }
            if (reqToUserId && typeof reqToUserId === 'function') {
                const userId = reqToUserId(req);
                req.visitor.set('user_id', userId);
                req.visitor.set('uid', userId);
                req.visitor.set('userId', userId);
            }
            req.visitor.pageview({
                dp: req.originalUrl,
                dr: req.get('Referer'),
                ua: req.headers['user-agent'],
                uip: (req.connection.remoteAddress
                    || req.socket.remoteAddress
                    || req.connection.remoteAddress
                    || req.headers['x-forwarded-for'].split(',').pop())
            });
        });
    }
    return middlewareWrapper;
}
module.exports = ExpressGA;
exports.default = ExpressGA;
//# sourceMappingURL=index.js.map