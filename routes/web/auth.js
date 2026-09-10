import express from "express";
import AuthController from "../../controllers/AuthController.js";

const router = express.Router();

router.get("/login", AuthController.getLoginPage);

export default router;
