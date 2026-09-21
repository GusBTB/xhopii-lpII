import express from "express";
import ProdutoController from "../../controllers/ProdutoController.js";

const router = express.Router();

router.get("/produtos", ProdutoController.getAllProdutos);
router.get("/produtos/:id", ProdutoController.getProdutoById);
router.post("/produtos", ProdutoController.createProduto);
router.put("/produtos/:id", ProdutoController.updateProduto);
router.delete("/produtos/:id", ProdutoController.deleteProduto);

export default router;