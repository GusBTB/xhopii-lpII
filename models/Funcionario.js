import bcrypt from "bcryptjs";
import FuncionarioModel from "./FuncionarioSchema.js";

// A imagem fica no documento, mas e pesada: as listagens trazem so o
// contentType, o que ja permite saber se existe foto. O binario e buscado
// sob demanda por findFoto().
const SEM_BINARIO = "-foto.data";

export default class Funcionario {
    constructor(
        nome,
        sobrenome,
        cpf,
        dataNascimento,
        telefone,
        cargo,
        salario,
        email,
        senha,
        foto,
    ) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.telefone = telefone;
        this.cargo = cargo;
        this.salario = salario;
        this.email = email;
        this.senha = senha;
        this.foto = foto;
    }

    async save() {
        const funcionario = new FuncionarioModel({
            nome: this.nome,
            sobrenome: this.sobrenome,
            cpf: this.cpf,
            dataNascimento: this.dataNascimento,
            telefone: this.telefone,
            cargo: this.cargo,
            salario: this.salario,
            email: this.email,
            senha: this.senha,
            foto: this.foto,
        });

        return await funcionario.save();
    }

    static async findAll() {
        return await FuncionarioModel.find().select(SEM_BINARIO);
    }

    static async findById(id) {
        return await FuncionarioModel.findById(id).select(SEM_BINARIO);
    }

    // Traz apenas a imagem, usada pela rota que serve a foto.
    static async findFoto(id) {
        return await FuncionarioModel.findById(id).select("foto");
    }

    static async findByCpf(cpf) {
        return await FuncionarioModel.findOne({ cpf });
    }

    static async findByEmail(email) {
        return await FuncionarioModel.findOne({ email });
    }

    // Usado apenas no login: traz a senha, que o schema esconde por padrao
    static async findByEmailComSenha(email) {
        return await FuncionarioModel.findOne({ email }).select("+senha");
    }

    static async update(id, dados) {
        const dadosParaGravar = { ...dados };

        // findByIdAndUpdate nao dispara o pre("save"), entao o hash e feito aqui
        if (dadosParaGravar.senha) {
            dadosParaGravar.senha = await bcrypt.hash(
                dadosParaGravar.senha,
                10,
            );
        }

        return await FuncionarioModel.findByIdAndUpdate(id, dadosParaGravar, {
            new: true,
        });
    }

    static async delete(id) {
        return await FuncionarioModel.findByIdAndDelete(id);
    }
}
