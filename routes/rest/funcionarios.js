import express from "express";
import FuncionarioController from "../../controllers/FuncionarioController.js";
import { exigirFuncionario } from "../../middlewares/authMiddlewares.js";
import { uploadFoto } from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

// Toda a colecao expoe CPF e salario: restrita a funcionarios.
router.get(
    "/api/funcionarios",
    exigirFuncionario,
    FuncionarioController.getAllFuncionarios,
);
router.get(
    "/api/funcionarios/:id",
    exigirFuncionario,
    FuncionarioController.getFuncionarioById,
);
router.post(
    "/api/funcionarios",
    exigirFuncionario,
    uploadFoto,
    FuncionarioController.createFuncionario,
);
router.put(
    "/api/funcionarios/:id",
    exigirFuncionario,
    uploadFoto,
    FuncionarioController.updateFuncionario,
);
router.delete(
    "/api/funcionarios/:id",
    exigirFuncionario,
    FuncionarioController.deleteFuncionario,
);

export default router;
