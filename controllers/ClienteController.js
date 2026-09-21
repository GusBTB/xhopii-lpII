import mongoose from "mongoose";
import Cliente from "../models/Cliente.js";
import { ehFormulario } from "../utils/requestUtils.js";
import { montarFoto } from "../middlewares/uploadMiddleware.js";

export default class ClienteController {
    // Erro vindo de formulario volta para a tela; erro de API volta como JSON.
    static responderErro(req, res, status, mensagem) {
        if (ehFormulario(req)) {
            return res
                .status(status)
                .render("cadastrar-cliente", { erro: mensagem });
        }

        return res.status(status).json({ message: mensagem });
    }

    static converterData(data) {
        if (data === undefined || data === null) {
            return undefined;
        }

        if (data instanceof Date) {
            return Number.isNaN(data.getTime()) ? null : data;
        }

        if (typeof data === "string") {
            const valor = data.trim();

            if (valor === "") {
                return undefined;
            }

            const formatoDiaMesAno = valor.match(
                /^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/,
            );
            const formatoAnoMesDia = valor.match(
                /^(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})$/,
            );

            if (formatoDiaMesAno) {
                const [, dia, mes, ano] = formatoDiaMesAno;
                return ClienteController.criarDataValida(ano, mes, dia);
            }

            if (formatoAnoMesDia) {
                const [, ano, mes, dia] = formatoAnoMesDia;
                return ClienteController.criarDataValida(ano, mes, dia);
            }

            const dataConvertida = new Date(valor);
            return Number.isNaN(dataConvertida.getTime())
                ? null
                : dataConvertida;
        }

        if (typeof data === "number") {
            const dataConvertida = new Date(data);
            return Number.isNaN(dataConvertida.getTime())
                ? null
                : dataConvertida;
        }

        return null;
    }

    static criarDataValida(ano, mes, dia) {
        const anoNumerico = Number(ano);
        const mesNumerico = Number(mes);
        const diaNumerico = Number(dia);
        const data = new Date(
            Date.UTC(anoNumerico, mesNumerico - 1, diaNumerico),
        );

        if (
            data.getUTCFullYear() !== anoNumerico ||
            data.getUTCMonth() !== mesNumerico - 1 ||
            data.getUTCDate() !== diaNumerico
        ) {
            return null;
        }

        return data;
    }

    static async getAllClientes(req, res) {
        try {
            const clientes = await Cliente.findAll();
            return res.json(clientes);
        } catch (error) {
            console.error("Erro ao carregar os clientes:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar clientes" });
        }
    }

    static async getClienteById(req, res) {
        try {
            const { id } = req.params; //Parâmetros URL

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const clienteExistente = await Cliente.findById(id);

            if (!clienteExistente) {
                return res
                    .status(404)
                    .json({ message: "Cliente não encontrado" });
            }
            return res.json(clienteExistente); //Retorna o cliente como JSON
        } catch (error) {
            console.error("Erro ao carregar o cliente:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar o cliente" });
        }
    }

    static async createCliente(req, res) {
        try {
            const {
                nome,
                sobrenome,
                cpf,
                dataNascimento,
                telefone,
                email,
                senha,
            } = req.body;

            // O multer nao derruba a requisicao: ele sinaliza aqui.
            if (req.erroUpload) {
                return ClienteController.responderErro(
                    req,
                    res,
                    400,
                    req.erroUpload,
                );
            }

            const dataNascimentoConvertida =
                ClienteController.converterData(dataNascimento);

            if (dataNascimentoConvertida === null) {
                return ClienteController.responderErro(
                    req,
                    res,
                    400,
                    "Data de nascimento inválida",
                );
            }

            const clienteComMesmoCpf = await Cliente.findByCpf(cpf);

            if (clienteComMesmoCpf) {
                return ClienteController.responderErro(
                    req,
                    res,
                    400,
                    "Já existe um cliente com esse CPF",
                );
            }

            const clienteComMesmoEmail = await Cliente.findByEmail(email);

            if (clienteComMesmoEmail) {
                return ClienteController.responderErro(
                    req,
                    res,
                    400,
                    "Já existe um cliente com esse e-mail",
                );
            } else {
                const novoCliente = new Cliente(
                    nome,
                    sobrenome,
                    cpf,
                    dataNascimentoConvertida,
                    telefone,
                    email,
                    senha,
                    montarFoto(req.file),
                );
                const clienteSalvo = await novoCliente.save();

                // Cadastro e publico: o visitante recem-criado ainda nao tem
                // token, entao e enviado para o login em vez da listagem.
                if (ehFormulario(req)) {
                    return res.redirect("/login");
                }

                clienteSalvo.senha = undefined;
                return res.status(201).json(clienteSalvo);
            }
        } catch (error) {
            console.error("Erro ao cadastrar cliente", error);
            return ClienteController.responderErro(
                req,
                res,
                500,
                "Erro interno ao cadastrar cliente",
            );
        }
    }

    static async updateCliente(req, res) {
        try {
            const { id } = req.params;
            const dados = { ...req.body };

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            if (
                Object.prototype.hasOwnProperty.call(dados, "dataNascimento")
            ) {
                const dataNascimentoConvertida =
                    ClienteController.converterData(dados.dataNascimento);

                if (dataNascimentoConvertida === null) {
                    return res.status(400).json({
                        message: "Data de nascimento inválida",
                    });
                }

                dados.dataNascimento = dataNascimentoConvertida;
            }

            if (req.erroUpload) {
                return res.status(400).json({ message: req.erroUpload });
            }

            const fotoEnviada = montarFoto(req.file);

            if (fotoEnviada) {
                dados.foto = fotoEnviada;
            }

            const clienteAtualizado = await Cliente.update(id, dados);

            if (!clienteAtualizado) {
                return res
                    .status(404)
                    .json({ message: "Cliente não encontrado" });
            }
            return res.json(clienteAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar o cliente:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao atualizar o cliente" });
        }
    }

    static async deleteCliente(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const clienteExcluido = await Cliente.delete(id);

            if (!clienteExcluido) {
                return res
                    .status(404)
                    .json({ message: "Cliente não encontrado" });
            }
            return res.json({ message: "Cliente excluído com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir o cliente:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao excluir o cliente" });
        }
    }

    // Serve a imagem gravada no MongoDB.
    static async getFotoCliente(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const cliente = await Cliente.findFoto(id);

            if (!cliente || !cliente.foto || !cliente.foto.data) {
                return res.status(404).json({ message: "Foto não encontrada" });
            }

            res.set("Content-Type", cliente.foto.contentType);
            return res.send(cliente.foto.data);
        } catch (error) {
            console.error("Erro ao carregar a foto do cliente:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar a foto" });
        }
    }

    //Implementação dos Renders das Páginas WEB
    static async renderCreateCliente(req, res) {
        try {
            return res.render("cadastrar-cliente", { erro: null });
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }

    static async renderAllClientes(req, res) {
        try {
            const clientes = await Cliente.findAll();
            return res.render("visualizar-cliente", { clientes: clientes });
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }
}
