import { identificarUsuario } from "../middlewares/authMiddlewares.js";

import WebHomeRouter from "./web/home.js";
import WebAuthRouter from "./web/auth.js";
import WebClientesRouter from "./web/clientes.js";
import WebFuncionariosRouter from "./web/funcionarios.js";
import WebProdutosRouter from "./web/produtos.js";

import RestClientesRouter from "./rest/clientes.js";
import RestFuncionariosRouter from "./rest/funcionarios.js";
import RestProdutosRouter from "./rest/produtos.js";
import RestCategoriasRouter from "./rest/categorias.js";

export default class GlobalRouter {
    constructor() {}
    static registerRoutes(app) {
        // Descobre quem esta acessando antes de qualquer rota. Nunca bloqueia:
        // quem bloqueia sao exigirLogin / exigirFuncionario, rota a rota.
        app.use(identificarUsuario);

        // importar as rotas dos arquivos adjacentes e registrá-las no aplicativo Express
        app.use(WebHomeRouter);
        app.use(WebAuthRouter);
        app.use(WebClientesRouter);
        app.use(WebFuncionariosRouter);
        app.use(WebProdutosRouter);

        app.use(RestClientesRouter);
        app.use(RestFuncionariosRouter);
        app.use(RestProdutosRouter);
        app.use(RestCategoriasRouter);
    }
}
