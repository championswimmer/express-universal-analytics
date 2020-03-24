/**
 * Created by championswimmer on 06/07/17.
 */
import * as express from 'express'
import { Request } from 'express'
import ExpressGA from '../dist'

const app = express();

app.use(ExpressGA('UA-XXXXXXX-X'));

app.get('/event', (req: Request, res) => {

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





