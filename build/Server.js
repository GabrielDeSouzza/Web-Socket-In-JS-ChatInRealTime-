"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
require("./websocket");
http_1.httpServer.listen(3000, '192.168.42.241');
