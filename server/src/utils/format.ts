// 📆 Formata datas no padrão "YYYY-MM-DD"
export const formatDate = (
  date: Date | string | null | undefined
): string | null => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
};

// 💰 Formata números como moeda em reais
export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  const number = Number(value);
  if (isNaN(number)) return "R$ 0,00";
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};

// ✅ Transforma booleanos em "Sim" / "Não"
export const formatBoolean = (
  value: boolean | null | undefined
): string => {
  if (value === null || value === undefined) return "-";
  return value ? "Sim" : "Não";
};
