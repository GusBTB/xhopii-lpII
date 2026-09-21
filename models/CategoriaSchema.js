import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            unique: true,
        },
        descricao: String,
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    },
);

export default mongoose.model("Categoria", CategoriaSchema);