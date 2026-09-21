import express from "express";

const router = express.Router();

// A Home da loja e a propria vitrine publica de produtos.
router.get("/", (req, res) => res.redirect("/ver-produto"));

// Tela estatica linkada pelo login. Recuperacao de senha nao faz parte
// do escopo obrigatorio da atividade.
router.get("/recuperar-senha", (req, res) => res.render("recuperar-senha"));

export default router;
