import path from "path";
import __dirname from "../utils/pathUtils.js";
import Cliente from "../models/Cliente.js";

export default class ClienteController {
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

            const dataNascimentoConvertida =
                ClienteController.converterData(dataNascimento);

            if (dataNascimentoConvertida === null) {
                return res.status(400).json({
                    message: "Data de nascimento inválida",
                });
            }

            const clienteComMesmoCpf = await Cliente.findByCpf(cpf);

            if (clienteComMesmoCpf) {
                return res
                    .status(400)
                    .json({ message: "Já existe um cliente com esse CPF" });
            }

            const clienteComMesmoEmail = await Cliente.findByEmail(email);

            if (clienteComMesmoEmail) {
                return res
                    .status(400)
                    .json({ message: "Já existe um cliente com esse e-mail" });
            } else {
                const novoCliente = new Cliente(
                    nome,
                    sobrenome,
                    cpf,
                    dataNascimentoConvertida,
                    telefone,
                    email,
                    senha,
                );
                await novoCliente.save();
                return res.status(201).json(novoCliente);
            }
        } catch (error) {
            console.error("Erro ao cadastrar cliente", error);
            return res.status(500).send("Erro interno");
        }
    }

    static async updateCliente(req, res) {
        try {
            const { id } = req.params;
            const dados = { ...req.body };

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

    //Implementação dos Renders das Páginas WEB
    static async renderCreateCliente(req, res) {
        try {
            return res.sendFile(
                path.join(__dirname, "views", "cadastrar-cliente.html"),
            );
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
