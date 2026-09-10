import __dirname from "../utils/pathUtils.js";
import path from "path";

export default class AuthController {
    constructor() {}
    static async getLoginPage(req, res) {
        try {
            return res.sendFile(path.join(__dirname, "views", "login.html"));
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }
}
