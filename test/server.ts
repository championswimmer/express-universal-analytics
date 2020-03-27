/**
 * Created by championswimmer on 06/07/17.
 */
import * as express from 'express'
import ExpressGA from '../dist'

const app = express();

app.use(ExpressGA('UA-XXXXXXX-X'));

ExpressGA({
  uaCode: 'UA-XXXX-X',
  autoTrackPages: false,
})

app.get('/event', (req, res) => {

  req.visitor.setUid('1123')

  req.visitor.event({
    dp: req.originalUrl,
    ea: 'visit',  // action
    ec: 'route',  // category
    el: 'sample', // label
    ev: 1,        // value
  })

  res.send('Event handled')
})





