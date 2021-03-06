"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const socketIo = __importStar(require("socket.io"));
const constants_1 = require("./constants");
const http_1 = require("http");
var cors = require('cors');
class ChatServer {
    constructor() {
        this._app = express();
        this.port = process.env.PORT || ChatServer.PORT;
        this._app.use(cors());
        this._app.options('*', cors());
        this.server = http_1.createServer(this._app);
        this.initSocket();
        this.listen();
    }
    initSocket() {
        this.io = socketIo(this.server);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on(constants_1.ChatEvent.CONNECT, (socket) => {
            console.log('Connected client on port %s.', this.port);
            socket.on(constants_1.ChatEvent.MESSAGE, (m) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });
            socket.on(constants_1.ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });
    }
    get app() {
        return this._app;
    }
}
ChatServer.PORT = 8080;
exports.ChatServer = ChatServer;
//# sourceMappingURL=chat.js.map