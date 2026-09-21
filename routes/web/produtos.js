import express from "express";
import ProdutoController from "../../controllers/ProdutoController.js";
import {
    exigirLogin,
    exigirFuncionario,
} from "../../middlewares/authMiddlewares.js";

const router = express.Router();

// Vitrine publica: nao exige login.
router.get("/ver-produto", ProdutoController.renderVitrine);

router.get(
    "/produto/cadastrar",
    exigirFuncionario,
    ProdutoController.renderCreateProduto,
);
router.get(
    "/produtos/visualizar",
    exigirLogin,
    ProdutoController.renderAllProdutos,
);

export default router;
