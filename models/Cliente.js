import ClienteModel from "./ClienteSchema.js";

export default class Cliente {
    constructor(nome, sobrenome, cpf, dataNascimento, telefone, email, senha) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
    }

    async save() {
        const cliente = new ClienteModel({
            nome: this.nome,
            sobrenome: this.sobrenome,
            cpf: this.cpf,
            dataNascimento: this.dataNascimento,
            telefone: this.telefone,
            email: this.email,
            senha: this.senha,
        });

        return await cliente.save();
    }

    static async findAll() {
        return await ClienteModel.find();
    }

    static async findById(id) {
        return await ClienteModel.findById(id);
    }

    static async findByCpf(cpf) {
        return await ClienteModel.findOne({ cpf });
    }

    static async findByEmail(email) {
        return await ClienteModel.findOne({ email });
    }

    static async update(id, dados) {
        return await ClienteModel.findByIdAndUpdate(id, dados, { new: true });
    }

    static async delete(id) {
        return await ClienteModel.findByIdAndDelete(id);
    }
}
