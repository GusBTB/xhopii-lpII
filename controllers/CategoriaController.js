import mongoose from "mongoose";
import Categoria from "../models/Categoria.js";

export default class CategoriaController {
    static async getAllCategorias(req, res) {
        try {
            const categorias = await Categoria.findAll();
            return res.json(categorias);
        } catch (error) {
            console.error("Erro ao carregar as categorias:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar categorias" });
        }
    }

    static async getCategoriaById(req, res) {
        try {
            const { id } = req.params; //Parâmetros URL

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const categoriaExistente = await Categoria.findById(id);

            if (!categoriaExistente) {
                return res
                    .status(404)
                    .json({ message: "Categoria não encontrada" });
            }
            return res.json(categoriaExistente); //Retorna a categoria como JSON
        } catch (error) {
            console.error("Erro ao carregar a categoria:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao buscar a categoria" });
        }
    }

    static async createCategoria(req, res) {
        try {
            const { nome, descricao } = req.body;

            const nomeTratado = typeof nome === "string" ? nome.trim() : nome;

            if (!nomeTratado) {
                return res
                    .status(400)
                    .json({ message: "Nome da categoria é obrigatório" });
            }

            const categoriaComMesmoNome = await Categoria.findByNome(
                nomeTratado,
            );

            if (categoriaComMesmoNome) {
                return res
                    .status(400)
                    .json({ message: "Já existe uma categoria com esse nome" });
            }

            const novaCategoria = new Categoria(nomeTratado, descricao);
            const categoriaSalva = await novaCategoria.save();
            return res.status(201).json(categoriaSalva);
        } catch (error) {
            console.error("Erro ao cadastrar categoria", error);
            return res.status(500).send("Erro interno");
        }
    }

    static async updateCategoria(req, res) {
        try {
            const { id } = req.params;
            const dados = { ...req.body };

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const dadosSemVazios = {};

            for (const chave of ["nome", "descricao"]) {
                const valor = dados[chave];

                if (valor === undefined || valor === null) {
                    continue;
                }

                if (typeof valor === "string" && valor.trim() === "") {
                    continue;
                }

                dadosSemVazios[chave] = valor;
            }

            if (dadosSemVazios.nome) {
                const categoriaComMesmoNome = await Categoria.findByNome(
                    dadosSemVazios.nome,
                );

                if (
                    categoriaComMesmoNome &&
                    categoriaComMesmoNome._id.toString() !== id
                ) {
                    return res.status(400).json({
                        message: "Já existe uma categoria com esse nome",
                    });
                }
            }

            const categoriaAtualizada = await Categoria.update(
                id,
                dadosSemVazios,
            );

            if (!categoriaAtualizada) {
                return res
                    .status(404)
                    .json({ message: "Categoria não encontrada" });
            }
            return res.json(categoriaAtualizada);
        } catch (error) {
            console.error("Erro ao atualizar a categoria:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao atualizar a categoria" });
        }
    }

    static async deleteCategoria(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const categoriaExcluida = await Categoria.delete(id);

            if (!categoriaExcluida) {
                return res
                    .status(404)
                    .json({ message: "Categoria não encontrada" });
            }
            return res.json({ message: "Categoria excluída com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir a categoria:", error);
            return res
                .status(500)
                .json({ message: "Erro interno ao excluir a categoria" });
        }
    }
}