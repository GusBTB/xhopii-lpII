import express from "express";
import FuncionarioController from "../../controllers/FuncionarioController.js";
import { exigirFuncionario } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

// Toda a area de funcionarios expoe CPF e salario: restrita a funcionarios.
router.get(
    "/funcionario/cadastrar",
    exigirFuncionario,
    FuncionarioController.renderCreateFuncionario,
);
router.get(
    "/funcionarios/visualizar",
    exigirFuncionario,
    FuncionarioController.renderAllFuncionarios,
);

// Serve a imagem gravada no MongoDB, consumida pelo <img> da listagem.
router.get(
    "/funcionarios/:id/foto",
    exigirFuncionario,
    FuncionarioController.getFotoFuncionario,
);

export default router;
