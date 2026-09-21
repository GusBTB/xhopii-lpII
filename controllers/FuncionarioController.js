import mongoose from "mongoose";
import Funcionario from "../models/Funcionario.js";
import {
    ehFormulario,
    converterData,
    converterNumero,
    removerCamposVazios,
} from "../utils/requestUtils.js";
import { montarFoto } from "../middlewares/uploadMiddleware.js";

export default class FuncionarioController {
    // Erro vindo de formulario volta para a tela; erro de API volta como JSON.
    static responderErro(req, res, status, mensagem) {
        if (ehFormulario(req)) {
            return res.status(status).render("cadastrar-funcionario", {
                erro: mensagem,
            });
        }

        return res.status(status).json({ message: mensagem });
    }

    static async getAllFuncionarios(req, res) {
        try {
            const funcionarios = await Funcionario.findAll();
            return res.json(funcionarios);
        } catch (error) {
            console.error("Erro ao carregar os funcionários:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar funcionários" });
        }
    }

    static async getFuncionarioById(req, res) {
        try {
            const { id } = req.params; //Parâmetros URL

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const funcionarioExistente = await Funcionario.findById(id);

            if (!funcionarioExistente) {
                return res
                    .status(404)
                    .json({ message: "Funcionário não encontrado" });
            }
            return res.json(funcionarioExistente); //Retorna o funcionário como JSON
        } catch (error) {
            console.error("Erro ao carregar o funcionário:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar o funcionário" });
        }
    }

    static async createFuncionario(req, res) {
        try {
            const {
                nome,
                sobrenome,
                cpf,
                dataNascimento,
                telefone,
                cargo,
                email,
                senha,
            } = req.body;

            // O multer nao derruba a requisicao: ele sinaliza aqui.
            if (req.erroUpload) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    req.erroUpload,
                );
            }

            const cpfTratado = typeof cpf === "string" ? cpf.trim() : cpf;
            const emailTratado =
                typeof email === "string" ? email.trim() : email;

            if (!cpfTratado) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    "CPF é obrigatório",
                );
            }

            if (!emailTratado) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    "E-mail é obrigatório",
                );
            }

            if (!senha) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    "Senha é obrigatória",
                );
            }

            const dataNascimentoConvertida = converterData(dataNascimento);

            if (dataNascimentoConvertida === null) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    "Data de nascimento inválida",
                );
            }

            const salarioConvertido = converterNumero(req.body.salario);

            if (salarioConvertido === null) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    "Salário inválido",
                );
            }

            const funcionarioComMesmoCpf =
                await Funcionario.findByCpf(cpfTratado);

            if (funcionarioComMesmoCpf) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    "Já existe um funcionário com esse CPF",
                );
            }

            const funcionarioComMesmoEmail =
                await Funcionario.findByEmail(emailTratado);

            if (funcionarioComMesmoEmail) {
                return FuncionarioController.responderErro(
                    req,
                    res,
                    400,
                    "Já existe um funcionário com esse e-mail",
                );
            }

            const novoFuncionario = new Funcionario(
                nome,
                sobrenome,
                cpfTratado,
                dataNascimentoConvertida,
                telefone,
                cargo,
                salarioConvertido,
                emailTratado,
                senha,
                montarFoto(req.file),
            );
            const funcionarioSalvo = await novoFuncionario.save();

            // Quem cadastra funcionário já está logado como funcionário,
            // então pode ir direto para a listagem.
            if (ehFormulario(req)) {
                return res.redirect("/funcionarios/visualizar");
            }

            funcionarioSalvo.senha = undefined;
            return res.status(201).json(funcionarioSalvo);
        } catch (error) {
            console.error("Erro ao cadastrar funcionário", error);
            return FuncionarioController.responderErro(
                req,
                res,
                500,
                "Erro interno ao cadastrar funcionário",
            );
        }
    }

    static async updateFuncionario(req, res) {
        try {
            const { id } = req.params;
            const dados = { ...req.body };

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const dadosSemVazios = removerCamposVazios(dados);

            if (
                Object.prototype.hasOwnProperty.call(dados, "dataNascimento")
            ) {
                const dataNascimentoConvertida = converterData(
                    dados.dataNascimento,
                );

                if (dataNascimentoConvertida === null) {
                    return res
                        .status(400)
                        .json({ message: "Data de nascimento inválida" });
                }

                if (dataNascimentoConvertida !== undefined) {
                    dadosSemVazios.dataNascimento = dataNascimentoConvertida;
                }
            }

            if (Object.prototype.hasOwnProperty.call(dados, "salario")) {
                const salarioConvertido = converterNumero(dados.salario);

                if (salarioConvertido === null) {
                    return res
                        .status(400)
                        .json({ message: "Salário inválido" });
                }

                if (salarioConvertido !== undefined) {
                    dadosSemVazios.salario = salarioConvertido;
                }
            }

            if (dadosSemVazios.cpf) {
                const funcionarioComMesmoCpf = await Funcionario.findByCpf(
                    dadosSemVazios.cpf,
                );

                if (
                    funcionarioComMesmoCpf &&
                    funcionarioComMesmoCpf._id.toString() !== id
                ) {
                    return res.status(400).json({
                        message: "Já existe um funcionário com esse CPF",
                    });
                }
            }

            if (dadosSemVazios.email) {
                const funcionarioComMesmoEmail =
                    await Funcionario.findByEmail(dadosSemVazios.email);

                if (
                    funcionarioComMesmoEmail &&
                    funcionarioComMesmoEmail._id.toString() !== id
                ) {
                    return res.status(400).json({
                        message: "Já existe um funcionário com esse e-mail",
                    });
                }
            }

            if (req.erroUpload) {
                return res.status(400).json({ message: req.erroUpload });
            }

            const fotoEnviada = montarFoto(req.file);

            if (fotoEnviada) {
                dadosSemVazios.foto = fotoEnviada;
            }

            const funcionarioAtualizado = await Funcionario.update(
                id,
                dadosSemVazios,
            );

            if (!funcionarioAtualizado) {
                return res
                    .status(404)
                    .json({ message: "Funcionário não encontrado" });
            }
            return res.json(funcionarioAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar o funcionário:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao atualizar o funcionário" });
        }
    }

    static async deleteFuncionario(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const funcionarioExcluido = await Funcionario.delete(id);

            if (!funcionarioExcluido) {
                return res
                    .status(404)
                    .json({ message: "Funcionário não encontrado" });
            }
            return res.json({ message: "Funcionário excluído com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir o funcionário:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao excluir o funcionário" });
        }
    }

    // Serve a imagem gravada no MongoDB.
    static async getFotoFuncionario(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const funcionario = await Funcionario.findFoto(id);

            if (!funcionario || !funcionario.foto || !funcionario.foto.data) {
                return res.status(404).json({ message: "Foto não encontrada" });
            }

            res.set("Content-Type", funcionario.foto.contentType);
            return res.send(funcionario.foto.data);
        } catch (error) {
            console.error("Erro ao carregar a foto do funcionário:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar a foto" });
        }
    }

    //Implementação dos Renders das Páginas WEB
    static async renderCreateFuncionario(req, res) {
        try {
            return res.render("cadastrar-funcionario", { erro: null });
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }

    static async renderAllFuncionarios(req, res) {
        try {
            const funcionarios = await Funcionario.findAll();
            return res.render("visualizar-funcionario", {
                funcionarios: funcionarios,
            });
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }
}
