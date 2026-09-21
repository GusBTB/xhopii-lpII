import CategoriaModel from "./CategoriaSchema.js";

export default class Categoria {
    constructor(nome, descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    async save() {
        const categoria = new CategoriaModel({
            nome: this.nome,
            descricao: this.descricao,
        });

        return await categoria.save();
    }

    static async findAll() {
        return await CategoriaModel.find();
    }

    static async findById(id) {
        return await CategoriaModel.findById(id);
    }

    static async findByNome(nome) {
        return await CategoriaModel.findOne({ nome });
    }

    static async update(id, dados) {
        return await CategoriaModel.findByIdAndUpdate(id, dados, { new: true });
    }

    static async delete(id) {
        return await CategoriaModel.findByIdAndDelete(id);
    }
}