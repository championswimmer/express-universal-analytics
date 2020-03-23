/**
 * Created by championswimmer on 05/01/17.
 */

import { NextFunction, Request, RequestHandler, Response } from 'express-serve-static-core'
import * as ua from 'universal-analytics'
import { Visitor } from 'universal-analytics'
declare module 'express-serve-static-core' {
  export interface Request {
    visitor: Visitor
  }
}

export interface ReqToUserId { (req: Request): string }

function ExpressGA(uaCode: string, cookieName?: string, reqToUserId?: ReqToUserId): RequestHandler {
  let middlewareOpts = { cookieName: cookieName || '_ga' }
  let middleware = ua.middleware(uaCode, middlewareOpts)

  async function middlewareWrapper(req: Request, res: Response, next: NextFunction) {
    middleware(req, res, next)
    if (!req.headers['x-forwarded-for']) {
      req.headers['x-forwarded-for'] = '0.0.0.0'
    }
    if (reqToUserId && typeof reqToUserId === 'function') {
      const userId = reqToUserId(req)
      req.visitor.set('user_id', userId)
      req.visitor.set('uid', userId)
      req.visitor.set('userId', userId)
    }
    req.visitor.pageview({
      dp: req.originalUrl,
      dr: req.get('Referer'),
      ua: req.headers['user-agent'],
      uip: (req.connection.remoteAddress
        || req.socket.remoteAddress
        || req.connection.remoteAddress
        || (<string>req.headers['x-forwarded-for']).split(',').pop())
    })
  }

  return middlewareWrapper
}

module.exports = ExpressGA
export default ExpressGA