"use strict";
exports.__esModule = true;
/**
 * Created by championswimmer on 06/07/17.
 */
var express = require("express");
var dist_1 = require("../dist");
var app = express();
app.use(dist_1["default"]('UA-XXXXXXX-X'));
app.get('/event', function (req, res) {
    req.visitor.event({
        dp: req.originalUrl,
        ea: 'visit',
        ec: 'route',
        el: 'sample',
        ev: 1
    });
    res.send('Event handled');
});
