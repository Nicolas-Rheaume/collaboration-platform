

export class AppRouter {
    public static default(app) {
        app.get('/', (req, res) => {  
            res.sendFile(__dirname + '/index.html');
        });
    };
}