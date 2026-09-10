import express from "express";
import ClienteController from "../../controllers/ClienteController.js";

const router = express.Router();

router.get("/clientes/cadastrar", ClienteController.renderCreateCliente);
router.get("/clientes/visualizar", ClienteController.renderAllClientes);

export default router;
