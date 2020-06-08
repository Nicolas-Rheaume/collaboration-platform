"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const socket_router_1 = require("./routes/socket.router");
class Application {
    // Main
    constructor() {
        this.app = express_1.default();
        this.http = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.http);
        this.port = process.env.SERVER_PORT || 3000;
        this.app.use(cors_1.default());
        this.app.options('*', cors_1.default());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.test = new socket_router_1.Test();
        this.listen();
    }
    listen() {
        this.http.listen(this.port, () => {
            console.log(`Server listening on port : ${this.port}`);
        });
        this.app.get('/', (req, res) => {
            let count = this.test.increase();
            res.send(`The sedulous hyena ate the antelope! ${count}`);
        });
    }
    get application() {
        return this.app;
    }
}
exports.Application = Application;
/*
// Configurations
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initializations

// Routes
app.get('/', (req, res) => {  res.send('The sedulous hyena ate the antelope!'); });

app.use(SocketRouter);

import test2 from './test2'


// Server
http.listen(port, () => {
  console.log(`Server listening on port : ${port}`);
});

/*
app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
*/ 
//# sourceMappingURL=app.js.map