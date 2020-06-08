"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegisterController {
    constructor(app, io, cs) {
        this.app = app;
        this.io = io;
        this.cs = cs;
        this.count = 0;
        app.get('/register', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });
        // User Connect
        io.on('connect', socket => {
            this.count++;
            console.log("connected: %s sockets connected", this.count);
        });
        io.on('connection', socket => {
            // User Disconnect
            socket.on('disconnect', () => {
                this.count--;
                console.log('Disconnected: %s sockets connected', this.count);
            });
        });
        //this.app.use('/register', (req, res) => {   this.register() })
    }
    register() {
        console.log('register');
    }
}
exports.RegisterController = RegisterController;
//# sourceMappingURL=register.controller.js.map