"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ua = require("universal-analytics");
require("./express");
function ExpressGA(params) {
    if (typeof params === 'string') {
        params = { uaCode: params };
    }
    if (!params.uaCode) {
        throw new Error('Cannot initialise ExpressGA without uaCode');
    }
    let middlewareOpts = { cookieName: params.cookieName || '_ga' };
    let preUaMiddleware = function (req, res, next) {
        // if _ga cookie is present, remove our internal cid
        if (req.cookies && req.cookies[middlewareOpts.cookieName]) {
            if (req.session && req.session.cid) {
                req.session.cid = (void 0);
                delete req.session.cid;
            }
        }
        // set x-forwarded-for if not exists
        if (!req.headers['x-forwarded-for']) {
            req.headers['x-forwarded-for'] = '0.0.0.0';
        }
    };
    let uaMiddleware = ua.middleware(params.uaCode, middlewareOpts);
    let postUaMiddleware = function (req, res, next) {
        req.visitor.setUid = function (uid) {
            if (req.session)
                req.session.gauid = uid;
            else
                req.visitor.set('uid', uid);
        };
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
        if (req.query['utm_source'])
            req.visitor.set('cs', req.query['utm_source']);
        if (req.query['utm_medium'])
            req.visitor.set('cm', req.query['utm_medium']);
        if (req.query['utm_campaign'])
            req.visitor.set('cn', req.query['utm_campaign']);
        req.visitor.set('dh', req.protocol + '://' + req.get('host'));
        next(); // actually call next now
        // auto track page in side effects
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
    };
    return ([
        preUaMiddleware,
        uaMiddleware,
        postUaMiddleware
    ]);
}
module.exports = ExpressGA;
exports.default = ExpressGA;
//# sourceMappingURL=index.js.map