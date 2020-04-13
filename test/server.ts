import express from 'express'
import ExpressGA from '..'

const app = express()

app.use(ExpressGA({
  uaCode: 'UA-XXXXXX-X',
  autoTrackPages: false
}))

app.get('/', (req, res) => {

  req.visitor.event({
    ea: 'xxxx',
    ec: 'yyyy',
    el: 'aaaa'
  }).send()

  res.send('Hello')
})

app.listen(3434)