# Express Universal Analytics

This is an [express](http://expressjs.com) middleware to enable
[Google Universal Analytics](http://analytics.google.com)
page tracking on your server.
You can use this with server-served pages, or any custom route
events.

[![TypeScript](https://img.shields.io/badge/TypeScript-declared-blue.svg)](https://typescriptlang.org/)

[![NPM](https://nodei.co/npm/express-universal-analytics.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/express-universal-analytics/)

## Install

```
npm install --save express-universal-analytics
```


## Usage

### Basic (auto page-view)
To simply track page views use this -

```javascript
import * as express from 'express'
import { Request } from 'express'
import ExpressGA from 'express-universal-analytics'

const app = express();

app.use(ExpressGA('UA-XXXXXXX-X'));

app.get('/hello', (req, res) => {
  res.send('Hello World')
})

app.listen(4444)
```
The middleware will automatically be tracking all page views

### Advanced (cookie and userid setup)

You can make this pair up with your frontend tracking
by acquiring the session from the frontend cookie.

```js
// GA on frontend uses a cookie called '_ga`
app.use(ExpressGA({
  uaCode: 'UA-XXXX-X',
  autoTrackPages: false,
  cookieName: '_ga',
}))
```
If you pass something else instead of `_ga` (not recommended) in cookie name, we will make our own separate cookie
and not use GTag one. 
Setting `autoTrackPages` to false will not track pageviews automatically
_this is something you might want to do if you're adding it to API routes_

Also to set userid, there are two ways. If you have a way to extract userid from req object, then pass 
a reqToUserId function. 

```js 
app.use(ExpressGA({
  uaCode: 'UA-XXXX-XX', // ga id
  cookieName: '_ga', // cookie name
  reqToUserId: (req) => req.user && req.user.id // extract user id from request
}))
```

If you have the userid in your context somewhere else, (not in req object), 
then do this instead 

```js
app.use(ExpressGA('UA-XXXXX-X'))

app.get('/somepage', (req, res) => {

  // get the user id 
  const userId = somePlaceToFetchUserIdFrom(x, y, z)

  // set it to visitor
  req.visitor.setUid(userId)

  res.send('Whatever it is')

})
```


### Custom Events
If you also want to generate custom events, we have a `req.visitor` on which
you can generate `screenview`, `pageview` and `events`
```js
app.get('/event', (req: Request, res) => {

  req.visitor.event({
    dp: req.originalUrl,
    ea: 'visit',  // action
    ec: 'route',  // category
    el: 'sample', // label
    ev: 1,        // value
  }).send()

  res.send('Event handled')
})
```

### Custom Transactions

We can also track transaction events  (chain the transaction with items if you want to track items)

```js
app.post('/purchase/:productId', (req: Request, res) => {

  req.visitor
  .transaction(
    // transaction id, revenue, shipping, tax, affiliate
    {ti: "trans-12345", tr: 500, ts: 50, tt: 100, ta: "Partner 13"}
  )
  .item(
    // item price, quantity, item code, name and category (iv)
    {ip: 300, iq: 1, ic: "item-54321", in: "Item 54321", iv: "Blue"}
  )
  .item({ip: 200, iq: 2, ic: "item-41325", in: "Item 41325", iv: "XXL"})
  .send()

  res.send('Whatever you do here')
})
```

## Parameters
Documentation for params like `dh`, `dp`, `uid`, `ti`, `tr` etc are all available here

<https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters>


## What it tracks

The middleware automatically tracks the following

| Tracked parameter | Description |
|-------------------|-------------|
| **document host** | Host of your website with protocol - eg **http://cb.lk** |
| **document path** | Part of the URL, after the domain name, i.e. **/b/c** in  http://a.com/b/c |
| **document referer** | The website from which the user came from, if any |
| **user agent** | The device/browser/OS used to browse the page |
| **ip address** | The user's ip Address|
| **campaign name** | From the query param `utm_campaign` |
| **campaign source** | From the query param `utm_source` |
| **campaign medium** | From the query param `utm_medium` |

All of this is fetched from the _**request**_ object. Here is the code basically -

```javascript
    dp: req.originalUrl,
    dr: req.get('Referer'),
    ua: req.headers['user-agent'],
    uip: req.headers['x-forwarded-for'].split(',').pop()
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress

```

## Thanks

This is a wrapper over the very useful node module [universal-analytics](http://npmjs.com/universal-analytics)
which in turn used the `http://www.google-analytics.com/collect` REST API.
