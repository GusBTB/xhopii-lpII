import WebAuthRouter from "./web/auth.js";
import WebClientesRouter from "./web/clientes.js";
import RestClientesRouter from "./rest/clientes.js";

export default class GlobalRouter {
    constructor() {}
    static registerRoutes(app) {
        // importar as rotas dos arquivos adjacentes e registrá-las no aplicativo Express
        app.use(WebAuthRouter);
        app.use(WebClientesRouter);
        app.use(RestClientesRouter);
    }
}
