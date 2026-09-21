import express from "express";
import ClienteController from "../../controllers/ClienteController.js";
import { exigirFuncionario } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

// Publica: qualquer visitante pode se cadastrar na loja.
router.get("/clientes/cadastrar", ClienteController.renderCreateCliente);

// Lista dados pessoais de todos os clientes: restrito a funcionarios.
router.get(
    "/clientes/visualizar",
    exigirFuncionario,
    ClienteController.renderAllClientes,
);

// Serve a imagem gravada no MongoDB, consumida pelo <img> da listagem.
router.get(
    "/clientes/:id/foto",
    exigirFuncionario,
    ClienteController.getFotoCliente,
);

export default router;
