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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ua = __importStar(require("universal-analytics"));
function ExpressGA(params) {
    if (typeof params === 'string') {
        params = { uaCode: params };
    }
    if (!params.uaCode) {
        throw new Error('Cannot initialise ExpressGA without uaCode');
    }
    let middlewareOpts = { cookieName: params.cookieName || '_ga' };
    let middleware = ua.middleware(params.uaCode, middlewareOpts);
    function middlewareWrapper(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // call the universal-analytic lib's middleware
            middleware(req, res, () => {
                req.visitor.setUid = function (uid) {
                    if (req.session)
                        req.session.gauid = uid;
                    else
                        req.visitor.set('uid', uid);
                };
                if (!req.headers['x-forwarded-for']) {
                    req.headers['x-forwarded-for'] = '0.0.0.0';
                }
                if (params.reqToUserId &&
                    typeof params.reqToUserId === 'function') {
                    // if reqToUserId function exists use it to generate uid
                    const userId = params.reqToUserId(req);
                    if (userId)
                        req.visitor.set('uid', userId);
                }
                else {
                    // else if it was in session pick it
                    req.visitor.set('uid', (req.session && req.session.gauid));
                }
                req.visitor.set('dh', req.protocol + '://' + req.get('host'));
                if (req.query['utm_source'])
                    req.visitor.set('cs', req.query['utm_source']);
                if (req.query['utm_medium'])
                    req.visitor.set('cm', req.query['utm_medium']);
                if (req.query['utm_campaign'])
                    req.visitor.set('cn', req.query['utm_campaign']);
                next(); // actually call next now
                if (params.autoTrackPages !== false) { // if absent, treat true
                    // pageview in side effects
                    req.visitor.pageview({
                        dp: req.originalUrl,
                        dr: req.get('Referer'),
                        ua: req.headers['user-agent'],
                        uip: (req.connection.remoteAddress
                            || req.socket.remoteAddress
                            || req.connection.remoteAddress
                            || req.headers['x-forwarded-for'].split(',').pop()),
                    }).send();
                }
            });
        });
    }
    return middlewareWrapper;
}
module.exports = ExpressGA;
exports.default = ExpressGA;
//# sourceMappingURL=index.js.map