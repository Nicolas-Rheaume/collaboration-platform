"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppRouter {
    static default(app) {
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });
    }
    ;
}
exports.AppRouter = AppRouter;
//# sourceMappingURL=app.router.js.map