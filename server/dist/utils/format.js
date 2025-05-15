"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBoolean = exports.formatCurrency = exports.formatDate = void 0;
// 📆 Formata datas no padrão "YYYY-MM-DD"
const formatDate = (date) => {
    if (!date)
        return null;
    try {
        return new Date(date).toISOString().split("T")[0];
    }
    catch (_a) {
        return null;
    }
};
exports.formatDate = formatDate;
// 💰 Formata números como moeda em reais
const formatCurrency = (value) => {
    const number = Number(value);
    if (isNaN(number))
        return "R$ 0,00";
    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};
exports.formatCurrency = formatCurrency;
// ✅ Transforma booleanos em "Sim" / "Não"
const formatBoolean = (value) => {
    if (value === null || value === undefined)
        return "-";
    return value ? "Sim" : "Não";
};
exports.formatBoolean = formatBoolean;
