import express from "express";
import ProdutoController from "../../controllers/ProdutoController.js";
import {
    exigirLogin,
    exigirFuncionario,
} from "../../middlewares/authMiddlewares.js";

const router = express.Router();

// Leitura: qualquer usuario autenticado.
router.get("/api/produtos", exigirLogin, ProdutoController.getAllProdutos);
router.get("/api/produtos/:id", exigirLogin, ProdutoController.getProdutoById);

// Escrita: somente funcionarios.
router.post("/api/produtos", exigirFuncionario, ProdutoController.createProduto);
router.put(
    "/api/produtos/:id",
    exigirFuncionario,
    ProdutoController.updateProduto,
);
router.delete(
    "/api/produtos/:id",
    exigirFuncionario,
    ProdutoController.deleteProduto,
);

export default router;
