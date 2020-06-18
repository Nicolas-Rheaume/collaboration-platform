"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const configuration_1 = require("./configuration");
const mysql_config_1 = require("./configs/mysql.config");
const socket_mw_1 = require("./mw/socket.mw");
const app_routes_1 = __importDefault(require("./routes/app.routes"));
const authenticate_controller_1 = require("./controllers/authenticate.controller");
const dashboard_controller_1 = require("./controllers/dashboard.controller");
require("reflect-metadata");
const user_model_1 = require("./models/user.model");
const page_model_1 = require("./models/page.model");
class App {
    constructor() {
        this.initialization();
        this.configuration();
        this.middleswares();
        this.routes();
        this.models();
        this.controllers();
    }
    initialization() {
        this.app = express_1.default();
        this.port = process.env.SERVER_PORT || configuration_1.configuration.SERVER_PORT;
        this.server = http_1.createServer(this.app);
        this.io = socket_io_1.default(this.server);
        this.smw = new socket_mw_1.SocketMW(this.io);
    }
    configuration() {
        this.app.use(cors_1.default());
        this.app.options('*', cors_1.default());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
    }
    middleswares() {
    }
    routes() {
        this.app.use('/', app_routes_1.default);
    }
    models() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield mysql_config_1.dbConfig;
                yield user_model_1.UserModel.initialize();
                yield page_model_1.PageModel.initialize();
                resolve();
            }));
        });
    }
    controllers() {
        const authenticateController = new authenticate_controller_1.AuthenticateController(this.app, this.io, this.smw);
        const dashboardController = new dashboard_controller_1.DashboardController(this.app, this.io, this.smw);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.server.listen(this.port, () => {
                console.log(`Server listening on port : ${this.port}`);
            });
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map