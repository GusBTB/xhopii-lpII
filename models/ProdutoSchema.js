import mongoose from "mongoose";

const ProdutoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        fabricante: String,
        descricao: String,
        valor: {
            type: Number,
            required: true,
        },
        quantidade: {
            type: Number,
            required: true,
        },
        foto: String,
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    },
);

export default mongoose.model("Produto", ProdutoSchema);