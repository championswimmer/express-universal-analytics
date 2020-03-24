# Express Universal Analytics

This is an [express](http://expressjs.com) middleware to enable
[Google Universal Analytics](http://analytics.google.com)
page tracking on your server.
You can use this with server-served pages, or any custom route
events.

[![TypeScript](https://img.shields.io/badge/TypeScript-declared-blue.svg)](https://typescriptlang.org/)

[![NPM](https://nodei.co/npm/express-ga-middleware.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/express-ga-middleware/)

## Install

```
npm install --save express-ga-middleware
```


## Usage

To simply track page views use this -

```javascript
import * as express from 'express'
import { Request } from 'express'
import ExpressGA from '../dist'

const app = express();

app.use(ExpressGA('UA-XXXXXXX-X'));

app.get('/hello', (req, res) => {
  res.send('Hello World')
})

app.listen(4444)
```


If you also want to generate events, we have a `req.visitor` on which
you can generate `screenview`, `pageview` and `events`
```js
app.get('/event', (req: Request, res) => {

  req.visitor.event({
    dp: req.originalUrl,
    ea: 'visit',  // action
    ec: 'route',  // category
    el: 'sample', // label
    ev: 1,        // value
  })

  res.send('Event handled')
})
```

## What it tracks

The middleware automatically tracks the following

| Tracked parameter | Description |
|-------------------|-------------|
| **document path** | Part of the URL, after the domain name, i.e. **/b/c** in  http://a.com/b/c |
| **document referer** | The website from which the user came from, if any |
| **user agent** | The device/browser/OS used to browse the page |
| **ip address** | The user's ip Address|

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