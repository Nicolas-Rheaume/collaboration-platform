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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const configuration_1 = require("../configuration");
class RegisterController {
    constructor(app, io, smw) {
        this.app = app;
        this.io = io;
        this.smw = smw;
        io.on('connection', socket => {
            // Login
            socket.on('user/login', ({ username, password }) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield this.login(socket, username, password).catch(err => { throw err; });
                    socket.emit("user/validated", response);
                }
                catch (err) {
                    socket.emit("user/login-error", err);
                }
            }));
            // Register
            socket.on('user/register', ({ username, email, password }) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const newUser = yield this.register(username, email, password).catch(err => { throw err; });
                    const response = yield this.login(socket, username, password).catch(err => { throw err; });
                    socket.emit("user/validated", response);
                }
                catch (err) {
                    socket.emit("user/register-error", err);
                }
            }));
            // Authenticate
            socket.on('user/authenticate', (token) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = yield this.authenticate(socket, token).catch(err => { throw err; });
                    socket.emit("user/currentUser", user);
                }
                catch (err) {
                    socket.emit("user/login-error", err);
                }
            }));
        });
    }
    // Login
    login(socket, loginUsername, loginPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { user, password } = yield user_model_1.UserModel.findOneWithPassword({ where: { username: loginUsername } }).catch(err => { throw err; });
                    bcryptjs_1.default.compare(loginPassword, password, (err, isMatch) => {
                        if (err)
                            reject("Passwords do not match");
                        else if (isMatch) {
                            const token = jsonwebtoken_1.default.sign({ username: user.username }, configuration_1.configuration.JWT_SECRET, {
                                expiresIn: 604800 // 1 week
                            });
                            this.smw.setUser(socket, user);
                            resolve({
                                success: true,
                                token: 'JWT ' + token,
                                user: user.getClientVersion()
                            });
                        }
                        else {
                            reject("Wrong password");
                        }
                    });
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    // Register
    register(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield user_model_1.UserModel.UsernameAndEmailDontExist(username, email).catch(err => { throw err; });
                    bcryptjs_1.default.genSalt(10, (err, salt) => {
                        if (err)
                            throw err;
                        else {
                            bcryptjs_1.default.hash(password, salt, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                else {
                                    const newUser = yield user_model_1.UserModel.create(username, email, hash, user_model_1.UserRole.CONTRIBUTOR).catch(err => { throw err; });
                                    resolve(newUser.getClientVersion());
                                }
                            }));
                        }
                    });
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    // Authenticate
    authenticate(socket, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (token == '' || token == null)
                        reject('Empty token');
                    else {
                        jsonwebtoken_1.default.verify(token.replace(/^JWT\s/, ''), configuration_1.configuration.JWT_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                reject("Invalid token");
                            else {
                                const newUser = yield user_model_1.UserModel.findOneByUsername(decoded.username).catch(err => { throw err; });
                                this.smw.setUser(socket, newUser);
                                resolve(newUser.getClientVersion());
                            }
                        }));
                    }
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
}
exports.RegisterController = RegisterController;
//# sourceMappingURL=register.controller.js.map