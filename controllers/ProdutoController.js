import path from "path";
import __dirname from "../utils/pathUtils.js";
import mongoose from "mongoose";
import Produto from "../models/Produto.js";

export default class ProdutoController {
    static converterNumero(valor) {
        if (valor === undefined || valor === null) {
            return undefined;
        }

        if (typeof valor === "number") {
            return Number.isNaN(valor) ? null : valor;
        }

        if (typeof valor === "string") {
            const texto = valor.trim();

            if (texto === "") {
                return undefined;
            }

            const textoComPonto = texto.replace(",", ".");
            const numero = Number(textoComPonto);
            return Number.isNaN(numero) ? null : numero;
        }

        const numero = Number(valor);
        return Number.isNaN(numero) ? null : numero;
    }

    static removerCamposVazios(dados) {
        const sanitizado = {};

        for (const chave of Object.keys(dados)) {
            const valor = dados[chave];

            if (valor === undefined || valor === null) {
                continue;
            }

            if (typeof valor === "string" && valor.trim() === "") {
                continue;
            }

            sanitizado[chave] = valor;
        }

        return sanitizado;
    }

    static async getAllProdutos(req, res) {
        try {
            const produtos = await Produto.findAll();
            return res.json(produtos);
        } catch (error) {
            console.error("Erro ao carregar os produtos:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar produtos" });
        }
    }

    static async getProdutoById(req, res) {
        try {
            const { id } = req.params; //Parâmetros URL

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const produtoExistente = await Produto.findById(id);

            if (!produtoExistente) {
                return res
                    .status(404)
                    .json({ message: "Produto não encontrado" });
            }
            return res.json(produtoExistente); //Retorna o produto como JSON
        } catch (error) {
            console.error("Erro ao carregar o produto:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar o produto" });
        }
    }

    static async createProduto(req, res) {
        try {
            const { nome, fabricante, descricao, valor, quantidade, foto } =
                req.body;

            const nomeTratado =
                typeof nome === "string" ? nome.trim() : nome;
            const valorConvertido = ProdutoController.converterNumero(valor);
            const quantidadeConvertida =
                ProdutoController.converterNumero(quantidade);

            if (!nomeTratado) {
                return res
                    .status(400)
                    .json({ message: "Nome do produto é obrigatório" });
            }

            if (valorConvertido === null) {
                return res.status(400).json({ message: "Valor inválido" });
            }

            if (valorConvertido === undefined) {
                return res
                    .status(400)
                    .json({ message: "Valor do produto é obrigatório" });
            }

            if (quantidadeConvertida === null) {
                return res
                    .status(400)
                    .json({ message: "Quantidade inválida" });
            }

            if (quantidadeConvertida === undefined) {
                return res
                    .status(400)
                    .json({ message: "Quantidade do produto é obrigatória" });
            }

            const produtoComMesmoNome = await Produto.findByNome(nomeTratado);

            if (produtoComMesmoNome) {
                return res
                    .status(400)
                    .json({ message: "Já existe um produto com esse nome" });
            }

            const novoProduto = new Produto(
                nomeTratado,
                fabricante,
                descricao,
                valorConvertido,
                quantidadeConvertida,
                foto,
            );
            const produtoSalvo = await novoProduto.save();
            return res.status(201).json(produtoSalvo);
        } catch (error) {
            console.error("Erro ao cadastrar produto", error);
            return res.status(500).send("Erro interno");
        }
    }

    static async updateProduto(req, res) {
        try {
            const { id } = req.params;
            const dados = { ...req.body };

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const dadosSemVazios =
                ProdutoController.removerCamposVazios(dados);

            for (const campo of ["valor", "quantidade"]) {
                if (Object.prototype.hasOwnProperty.call(dados, campo)) {
                    const valorConvertido =
                        ProdutoController.converterNumero(dados[campo]);

                    if (valorConvertido === null) {
                        return res
                            .status(400)
                            .json({ message: `${campo} inválido` });
                    }

                    if (valorConvertido === undefined) {
                        continue; //campo vazio no update não altera
                    }

                    dadosSemVazios[campo] = valorConvertido;
                }
            }

            if (dadosSemVazios.nome) {
                const produtoComMesmoNome = await Produto.findByNome(
                    dadosSemVazios.nome,
                );

                if (
                    produtoComMesmoNome &&
                    produtoComMesmoNome._id.toString() !== id
                ) {
                    return res
                        .status(400)
                        .json({ message: "Já existe um produto com esse nome" });
                }
            }

            const produtoAtualizado = await Produto.update(id, dadosSemVazios);

            if (!produtoAtualizado) {
                return res
                    .status(404)
                    .json({ message: "Produto não encontrado" });
            }
            return res.json(produtoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar o produto:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao atualizar o produto" });
        }
    }

    static async deleteProduto(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const produtoExcluido = await Produto.delete(id);

            if (!produtoExcluido) {
                return res
                    .status(404)
                    .json({ message: "Produto não encontrado" });
            }
            return res.json({ message: "Produto excluído com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir o produto:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao excluir o produto" });
        }
    }

    //Implementação dos Renders das Páginas WEB
    static async renderCreateProduto(req, res) {
        try {
            return res.sendFile(
                path.join(__dirname, "views", "cadastrar-produto.html"),
            );
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }

    static async renderAllProdutos(req, res) {
        try {
            const produtos = await Produto.findAll();
            return res.render("visualizar-produto", { produtos: produtos });
        } catch (error) {
            console.error("Erro ao carregar a página:", error);
            return res.status(500).send("Erro interno");
        }
    }
}