import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema(
    {
        nome: String,
        sobrenome: String,
        cpf: {
            type: String,
            required: true,
            unique: true,
        },
        dataNascimento: Date,
        telefone: String,
        email: {
            type: String,
            required: true,
            unique: true,
        },
        senha: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    },
);

export default mongoose.model("Cliente", ClienteSchema);
