import jwt from "jsonwebtoken";
import { NOME_COOKIE } from "../controllers/AuthController.js";

// Le o token do cookie (navegador) ou do header Authorization (Postman).
function extrairToken(req) {
    if (req.cookies && req.cookies[NOME_COOKIE]) {
        return req.cookies[NOME_COOKIE];
    }

    const cabecalho = req.headers.authorization || "";

    if (cabecalho.startsWith("Bearer ")) {
        return cabecalho.slice(7);
    }

    return null;
}

// Requisicoes para /api recebem JSON; telas recebem redirecionamento.
function negar(req, res, status, mensagem) {
    if (req.path.startsWith("/api")) {
        return res.status(status).json({ message: mensagem });
    }

    return res.redirect("/login");
}

// Global e nunca bloqueia: apenas descobre quem esta acessando,
// para que o menu das telas saiba o que exibir.
export function identificarUsuario(req, res, next) {
    const token = extrairToken(req);

    req.usuario = null;
    res.locals.usuario = null;

    if (!token) {
        return next();
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        res.locals.usuario = payload;
    } catch (error) {
        // Token invalido ou expirado: segue como visitante.
        res.clearCookie(NOME_COOKIE);
    }

    return next();
}

// Exige qualquer usuario autenticado.
export function exigirLogin(req, res, next) {
    if (!req.usuario) {
        return negar(req, res, 401, "Autenticação necessária");
    }

    return next();
}

// Exige usuario autenticado do tipo funcionario.
export function exigirFuncionario(req, res, next) {
    if (!req.usuario) {
        return negar(req, res, 401, "Autenticação necessária");
    }

    if (req.usuario.tipo !== "funcionario") {
        return negar(req, res, 403, "Acesso restrito a funcionários");
    }

    return next();
}
