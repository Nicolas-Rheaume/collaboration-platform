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
const test_1 = require("./test");
const app = express_1.default();
const http = new http_1.default.Server(app);
const port = process.env.SERVER_PORT || 3000;
const io = socket_io_1.default(http);
// Configurations
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Initializations
// Routes
app.get('/', (req, res) => { res.send('The sedulous hyena ate the antelope!'); });
app.use(test_1.TestRouter);
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