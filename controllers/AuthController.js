import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cliente from "../models/Cliente.js";
import Funcionario from "../models/Funcionario.js";

const NOME_COOKIE = "token";
const EXPIRACAO = "1h";

export default class AuthController {
    constructor() {}

    static async getLoginPage(req, res) {
        try {
            return res.render("login", { erro: null });
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }

    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res
                    .status(400)
                    .render("login", { erro: "Informe e-mail e senha" });
            }

            const emailTratado = email.trim();

            // Procura primeiro em Cliente; se nao achar, tenta Funcionario.
            let usuario = await Cliente.findByEmailComSenha(emailTratado);
            let tipo = "cliente";

            if (!usuario) {
                usuario = await Funcionario.findByEmailComSenha(emailTratado);
                tipo = "funcionario";
            }

            if (!usuario) {
                return res
                    .status(401)
                    .render("login", { erro: "E-mail ou senha inválidos" });
            }

            const senhaConfere = await bcrypt.compare(senha, usuario.senha);

            if (!senhaConfere) {
                return res
                    .status(401)
                    .render("login", { erro: "E-mail ou senha inválidos" });
            }

            const token = jwt.sign(
                {
                    id: usuario._id.toString(),
                    email: usuario.email,
                    nome: usuario.nome,
                    tipo: tipo,
                },
                process.env.JWT_SECRET,
                { expiresIn: EXPIRACAO },
            );

            res.cookie(NOME_COOKIE, token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false, // localhost roda em HTTP
                maxAge: 60 * 60 * 1000, // 1 hora
            });

            return res.redirect("/");
        } catch (error) {
            console.error("Erro ao efetuar login:", error);
            return res
                .status(500)
                .render("login", { erro: "Erro interno ao efetuar login" });
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie(NOME_COOKIE);
            return res.redirect("/login");
        } catch (error) {
            console.error("Erro ao efetuar logout:", error);
            return res.status(500).send("Erro interno");
        }
    }
}

export { NOME_COOKIE };
