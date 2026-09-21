import ProdutoModel from "./ProdutoSchema.js";

export default class Produto {
    constructor(nome, fabricante, descricao, valor, quantidade, foto) {
        this.nome = nome;
        this.fabricante = fabricante;
        this.descricao = descricao;
        this.valor = valor;
        this.quantidade = quantidade;
        this.foto = foto;
    }

    async save() {
        const produto = new ProdutoModel({
            nome: this.nome,
            fabricante: this.fabricante,
            descricao: this.descricao,
            valor: this.valor,
            quantidade: this.quantidade,
            foto: this.foto,
        });

        return await produto.save();
    }

    static async findAll() {
        return await ProdutoModel.find();
    }

    static async findById(id) {
        return await ProdutoModel.findById(id);
    }

    static async findByNome(nome) {
        return await ProdutoModel.findOne({ nome });
    }

    static async update(id, dados) {
        return await ProdutoModel.findByIdAndUpdate(id, dados, { new: true });
    }

    static async delete(id) {
        return await ProdutoModel.findByIdAndDelete(id);
    }
}