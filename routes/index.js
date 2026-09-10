import WebAuthRouter from "./web/auth.js";
export default class GlobalRouter {
    constructor() {}
    static registerRoutes(app) {
        // importar as rotas dos arquivos adjacentes e registrá-las no aplicativo Express
        app.use(WebAuthRouter);
    }
}
