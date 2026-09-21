// Helpers compartilhados pelos Controllers.

// Um formulario HTML envia application/x-www-form-urlencoded ou, quando tem
// campo de arquivo, multipart/form-data. O Postman/Insomnia envia
// application/json. E assim que o Controller decide entre
// redirecionar/renderizar (navegador) e responder JSON (API).
export function ehFormulario(req) {
    const tipo = req.headers["content-type"] || "";
    return (
        tipo.includes("application/x-www-form-urlencoded") ||
        tipo.includes("multipart/form-data")
    );
}

// Converte string de data para Date.
// Retorna undefined quando o campo nao foi enviado e null quando e invalido.
export function converterData(data) {
    if (data === undefined || data === null) {
        return undefined;
    }

    if (data instanceof Date) {
        return Number.isNaN(data.getTime()) ? null : data;
    }

    if (typeof data === "string") {
        const valor = data.trim();

        if (valor === "") {
            return undefined;
        }

        const formatoDiaMesAno = valor.match(
            /^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/,
        );
        const formatoAnoMesDia = valor.match(
            /^(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})$/,
        );

        if (formatoDiaMesAno) {
            const [, dia, mes, ano] = formatoDiaMesAno;
            return criarDataValida(ano, mes, dia);
        }

        if (formatoAnoMesDia) {
            const [, ano, mes, dia] = formatoAnoMesDia;
            return criarDataValida(ano, mes, dia);
        }

        const dataConvertida = new Date(valor);
        return Number.isNaN(dataConvertida.getTime()) ? null : dataConvertida;
    }

    if (typeof data === "number") {
        const dataConvertida = new Date(data);
        return Number.isNaN(dataConvertida.getTime()) ? null : dataConvertida;
    }

    return null;
}

export function criarDataValida(ano, mes, dia) {
    const anoNumerico = Number(ano);
    const mesNumerico = Number(mes);
    const diaNumerico = Number(dia);
    const data = new Date(Date.UTC(anoNumerico, mesNumerico - 1, diaNumerico));

    if (
        data.getUTCFullYear() !== anoNumerico ||
        data.getUTCMonth() !== mesNumerico - 1 ||
        data.getUTCDate() !== diaNumerico
    ) {
        return null;
    }

    return data;
}

// Converte string para numero, aceitando virgula decimal.
// Retorna undefined quando o campo nao foi enviado e null quando e invalido.
export function converterNumero(valor) {
    if (valor === undefined || valor === null) {
        return undefined;
    }

    if (typeof valor === "number") {
        return Number.isNaN(valor) ? null : valor;
    }

    if (typeof valor === "string") {
        const texto = valor.trim();

        if (texto === "") {
            return undefined;
        }

        const numero = Number(texto.replace(",", "."));
        return Number.isNaN(numero) ? null : numero;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
}

// Remove chaves undefined, null e strings vazias de um objeto de update.
export function removerCamposVazios(dados) {
    const sanitizado = {};

    for (const chave of Object.keys(dados)) {
        const valor = dados[chave];

        if (valor === undefined || valor === null) {
            continue;
        }

        if (typeof valor === "string" && valor.trim() === "") {
            continue;
        }

        sanitizado[chave] = valor;
    }

    return sanitizado;
}
