/*
 * Popula o banco com dados iniciais para desenvolvimento e apresentacao.
 *
 * ATENCAO: este script APAGA as colecoes clientes, funcionarios, produtos
 * e categorias antes de recriar os dados. Confira o MONGODB_URI do seu .env
 * antes de rodar.
 *
 * Uso: node seed.js
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Database from "./config/db.js";
import ClienteModel from "./models/ClienteSchema.js";
import FuncionarioModel from "./models/FuncionarioSchema.js";
import ProdutoModel from "./models/ProdutoSchema.js";
import CategoriaModel from "./models/CategoriaSchema.js";

dotenv.config();

// Credenciais do administrador inicial. Sem ele nao ha como criar o primeiro
// funcionario, porque a rota de cadastro exige um funcionario autenticado.
const ADMIN = {
    nome: "Admin",
    sobrenome: "Xhopii",
    cpf: "00000000000",
    dataNascimento: new Date(Date.UTC(1990, 0, 1)),
    telefone: "(11) 90000-0000",
    cargo: "Administrador",
    salario: 5000,
    email: "admin@xhopii.com",
    senha: "admin123",
};

const FUNCIONARIOS = [
    {
        nome: "Mariana",
        sobrenome: "Souza",
        cpf: "11111111111",
        dataNascimento: new Date(Date.UTC(1995, 4, 12)),
        telefone: "(11) 91111-1111",
        cargo: "Vendedora",
        salario: 2800,
        email: "mariana@xhopii.com",
        senha: "senha123",
    },
    {
        nome: "Carlos",
        sobrenome: "Pereira",
        cpf: "22222222222",
        dataNascimento: new Date(Date.UTC(1988, 8, 3)),
        telefone: "(11) 92222-2222",
        cargo: "Estoquista",
        salario: 2400,
        email: "carlos@xhopii.com",
        senha: "senha123",
    },
];

const CLIENTES = [
    {
        nome: "Joana",
        sobrenome: "Lima",
        cpf: "33333333333",
        dataNascimento: new Date(Date.UTC(2000, 1, 20)),
        telefone: "(11) 93333-3333",
        email: "joana@email.com",
        senha: "cliente123",
    },
    {
        nome: "Rafael",
        sobrenome: "Alves",
        cpf: "44444444444",
        dataNascimento: new Date(Date.UTC(1997, 10, 8)),
        telefone: "(11) 94444-4444",
        email: "rafael@email.com",
        senha: "cliente123",
    },
];

const CATEGORIAS = [
    { nome: "Eletrônicos", descricao: "Celulares, fones e acessórios" },
    { nome: "Informática", descricao: "Notebooks, teclados e monitores" },
    { nome: "Games", descricao: "Consoles, jogos e controles" },
];

const PRODUTOS = [
    {
        nome: "Fone Bluetooth XZ",
        fabricante: "SoundMax",
        descricao: "Fone sem fio com cancelamento de ruído",
        valor: 249.9,
        quantidade: 30,
        foto: "/img/produto1.png",
    },
    {
        nome: "Teclado Mecânico RGB",
        fabricante: "KeyPro",
        descricao: "Teclado mecânico switch blue com iluminação RGB",
        valor: 329.9,
        quantidade: 18,
        foto: "/img/produto2.png",
    },
    {
        nome: "Mouse Gamer 7200DPI",
        fabricante: "KeyPro",
        descricao: "Mouse óptico com 6 botões programáveis",
        valor: 149.9,
        quantidade: 42,
        foto: "/img/produto3.png",
    },
    {
        nome: "Monitor 24 Full HD",
        fabricante: "ViewLine",
        descricao: "Monitor IPS 24 polegadas 75Hz",
        valor: 899.0,
        quantidade: 12,
        foto: "/img/produto4.png",
    },
    {
        nome: "Controle Sem Fio Pro",
        fabricante: "PlayGear",
        descricao: "Controle sem fio compatível com PC e console",
        valor: 279.9,
        quantidade: 25,
        foto: "/img/produto5.png",
    },
];

async function seed() {
    await Database.connect();

    console.log("Limpando coleções...");
    await Promise.all([
        ClienteModel.deleteMany({}),
        FuncionarioModel.deleteMany({}),
        ProdutoModel.deleteMany({}),
        CategoriaModel.deleteMany({}),
    ]);

    // create() dispara o pre("save") dos schemas, entao as senhas sao hasheadas.
    console.log("Criando funcionários...");
    await FuncionarioModel.create([ADMIN, ...FUNCIONARIOS]);

    console.log("Criando clientes...");
    await ClienteModel.create(CLIENTES);

    console.log("Criando categorias...");
    await CategoriaModel.create(CATEGORIAS);

    console.log("Criando produtos...");
    await ProdutoModel.create(PRODUTOS);

    console.log("");
    console.log("Seed concluída.");
    console.log(`  funcionários: ${1 + FUNCIONARIOS.length}`);
    console.log(`  clientes:     ${CLIENTES.length}`);
    console.log(`  categorias:   ${CATEGORIAS.length}`);
    console.log(`  produtos:     ${PRODUTOS.length}`);
    console.log("");
    console.log("Login de administrador:");
    console.log(`  ${ADMIN.email} / ${ADMIN.senha}`);
    console.log("Login de cliente:");
    console.log(`  ${CLIENTES[0].email} / ${CLIENTES[0].senha}`);

    await Database.disconnect();
}

seed().catch(async (error) => {
    console.error("Erro ao executar a seed:", error);
    await mongoose.disconnect();
    process.exit(1);
});
