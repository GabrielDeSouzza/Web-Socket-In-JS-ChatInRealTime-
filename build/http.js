"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(session({ secret: 'dfdsfsdfd' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.set('public', path_1.default.join(__dirname, '/public'));
app.get('/', (req, res) => {
    console.log(req, res);
    res.render("index");
});
app.post('/', (req, res) => {
    console.log(req.body.select_room);
    res.render('../public/chat');
});
const httpServer = http_1.default.createServer(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer);
exports.io = io;
