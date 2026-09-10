import express from "express";
import ClienteController from "../../controllers/ClienteController.js";

const router = express.Router();

router.get("/clientes", ClienteController.getAllClientes);
router.get("/clientes/:id", ClienteController.getClienteById);
router.post("/clientes", ClienteController.createCliente);
router.put("/clientes/:id", ClienteController.updateCliente);
router.delete("/clientes/:id", ClienteController.deleteCliente);

export default router;
