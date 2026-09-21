import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const FuncionarioSchema = new mongoose.Schema(
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
        cargo: String,
        salario: Number,
        email: {
            type: String,
            required: true,
            unique: true,
        },
        senha: {
            type: String,
            required: true,
            select: false, // Nunca volta nas consultas, a nao ser com .select("+senha")
        },
        foto: {
            data: Buffer,
            contentType: String,
        },
    },
    {
        timestamps: true, // Cria campos de createdAt e updatedAt automaticamente
    },
);

// Hasheia a senha antes de gravar, sempre que ela mudar
FuncionarioSchema.pre("save", async function (next) {
    if (!this.isModified("senha")) {
        return next();
    }

    this.senha = await bcrypt.hash(this.senha, 10);
    return next();
});

export default mongoose.model("Funcionario", FuncionarioSchema);
