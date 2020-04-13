"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var __1 = __importDefault(require(".."));
var app = express_1.default();
app.use(__1.default({
    uaCode: 'UA-XXXXXX-X',
    autoTrackPages: false
}));
app.get('/', function (req, res) {
    req.visitor.event({
        ea: 'xxxx',
        ec: 'yyyy',
        el: 'aaaa'
    }).send();
    res.send('Hello');
});
app.listen(3434);
//# sourceMappingURL=server.js.map