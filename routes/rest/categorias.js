import express from "express";
import CategoriaController from "../../controllers/CategoriaController.js";

const router = express.Router();

router.get("/categorias", CategoriaController.getAllCategorias);
router.get("/categorias/:id", CategoriaController.getCategoriaById);
router.post("/categorias", CategoriaController.createCategoria);
router.put("/categorias/:id", CategoriaController.updateCategoria);
router.delete("/categorias/:id", CategoriaController.deleteCategoria);

export default router;