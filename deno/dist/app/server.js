"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const socket_io_1 = __importDefault(require("socket.io"));
const app_router_1 = require("./routes/app.router");
const connection_service_1 = require("./services/connection.service");
const register_controller_1 = require("./controllers/register.controller");
class Application {
    // Main
    constructor() {
        // Constants
        this.app = express_1.default();
        this.port = process.env.SERVER_PORT || 3000;
        this.server = http_1.createServer(this.app);
        this.io = socket_io_1.default(this.server);
        // Configurations
        this.app.use(cors_1.default());
        this.app.options('*', cors_1.default());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        // Initialization
        this.cs = new connection_service_1.ConnectionService();
        // Static paths
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "../client/dist")));
        // Controllers
        new register_controller_1.RegisterController(this.app, this.io, this.cs);
        // Routers
        app_router_1.AppRouter.default(this.app);
        //this.socketService = new SocketService(this.io);
        // Server
        this.listen();
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port : ${this.port}`);
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
//# sourceMappingURL=server.js.map