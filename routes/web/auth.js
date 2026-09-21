import express from "express";
import AuthController from "../../controllers/AuthController.js";

const router = express.Router();

// Rotas publicas: sao a porta de entrada da aplicacao.
router.get("/login", AuthController.getLoginPage);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);

export default router;
