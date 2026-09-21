import multer from "multer";

const TAMANHO_MAXIMO = 2 * 1024 * 1024; // 2 MB

const TIPOS_ACEITOS = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
];

// memoryStorage: o arquivo fica em req.file.buffer e vai direto para o
// MongoDB, sem passar por disco.
const armazenamento = multer.memoryStorage();

const upload = multer({
    storage: armazenamento,
    limits: { fileSize: TAMANHO_MAXIMO },
    fileFilter: (req, file, cb) => {
        if (!TIPOS_ACEITOS.includes(file.mimetype)) {
            return cb(new Error("Formato de imagem não suportado"));
        }

        return cb(null, true);
    },
});

// Recebe um unico arquivo no campo "foto" e transforma erro do multer
// em mensagem tratavel pelo Controller, em vez de derrubar a requisicao.
export function uploadFoto(req, res, next) {
    upload.single("foto")(req, res, (erro) => {
        if (erro) {
            req.erroUpload =
                erro.code === "LIMIT_FILE_SIZE"
                    ? "A imagem deve ter no máximo 2 MB"
                    : erro.message;
        }

        return next();
    });
}

// Monta o subdocumento gravado no MongoDB a partir do arquivo recebido.
export function montarFoto(file) {
    if (!file || !file.buffer || file.buffer.length === 0) {
        return undefined;
    }

    return {
        data: file.buffer,
        contentType: file.mimetype,
    };
}

export { TAMANHO_MAXIMO, TIPOS_ACEITOS };
