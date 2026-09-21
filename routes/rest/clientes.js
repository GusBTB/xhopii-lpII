import express from "express";
import ClienteController from "../../controllers/ClienteController.js";
import { exigirFuncionario } from "../../middlewares/authMiddlewares.js";
import { uploadFoto } from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

// Publica: e o cadastro da loja, usado pelo link "Novo na Xhopii?".
// uploadFoto le o campo de arquivo "foto" do formulario.
router.post("/api/clientes", uploadFoto, ClienteController.createCliente);

// Dados pessoais de clientes: restrito a funcionarios.
router.get("/api/clientes", exigirFuncionario, ClienteController.getAllClientes);
router.get(
    "/api/clientes/:id",
    exigirFuncionario,
    ClienteController.getClienteById,
);
router.put(
    "/api/clientes/:id",
    exigirFuncionario,
    uploadFoto,
    ClienteController.updateCliente,
);
router.delete(
    "/api/clientes/:id",
    exigirFuncionario,
    ClienteController.deleteCliente,
);

export default router;
