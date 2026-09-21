import express from "express";
import ProdutoController from "../../controllers/ProdutoController.js";

const router = express.Router();

router.get("/produto/cadastrar", ProdutoController.renderCreateProduto);
router.get("/produtos/visualizar", ProdutoController.renderAllProdutos);

export default router;