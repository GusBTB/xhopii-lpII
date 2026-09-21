import express from "express";
import CategoriaController from "../../controllers/CategoriaController.js";
import {
    exigirLogin,
    exigirFuncionario,
} from "../../middlewares/authMiddlewares.js";

const router = express.Router();

// Leitura: qualquer usuario autenticado.
router.get("/api/categorias", exigirLogin, CategoriaController.getAllCategorias);
router.get(
    "/api/categorias/:id",
    exigirLogin,
    CategoriaController.getCategoriaById,
);

// Escrita: somente funcionarios.
router.post(
    "/api/categorias",
    exigirFuncionario,
    CategoriaController.createCategoria,
);
router.put(
    "/api/categorias/:id",
    exigirFuncionario,
    CategoriaController.updateCategoria,
);
router.delete(
    "/api/categorias/:id",
    exigirFuncionario,
    CategoriaController.deleteCategoria,
);

export default router;
