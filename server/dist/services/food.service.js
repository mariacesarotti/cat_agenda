"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFoodNeeds = void 0;
const calculateFoodNeeds = ({ age_category, type, num_of_cats, }) => {
    const diasNoMes = 30;
    const pesoMedio = 5; // peso médio padrão, pode ser adaptado depois
    // valores de referência diários por gato (em gramas)
    let diariaSeca = 0;
    let diariaUmida = 0;
    let diariaNatural = 0;
    switch (type.toLowerCase()) {
        case "seca":
            diariaSeca =
                age_category === "filhote"
                    ? pesoMedio * 20
                    : pesoMedio * 25;
            break;
        case "umida":
            diariaUmida = (pesoMedio * 85) / 1.5;
            break;
        case "seca+umida":
            diariaSeca = pesoMedio * 15; // ~60% da seca
            diariaUmida = pesoMedio * 50; // ~40% da úmida
            break;
        case "natural":
            diariaNatural =
                age_category === "filhote"
                    ? 400
                    : pesoMedio * 150;
            break;
    }
    const monthlySeca = diariaSeca * diasNoMes * num_of_cats;
    const monthlyUmida = diariaUmida * diasNoMes * num_of_cats;
    const monthlyNatural = diariaNatural * diasNoMes * num_of_cats;
    // estimativas de embalagens
    const foodBagsToBuy = Math.ceil(monthlySeca / 4000); // sacos de 4kg
    const foodCansToBuy = Math.ceil(monthlyUmida / 85); // latas de 85g
    const foodNaturalKg = Math.ceil(monthlyNatural / 1000); // natural em kg
    // calcular frequência de compra (base estimada)
    const frequencyOfBuying = type === "seca+umida" ? 20 : 30;
    return {
        foodKgPerMonth: (monthlySeca + monthlyUmida + monthlyNatural) / 1000,
        foodBagsToBuy: type.includes("seca") ? foodBagsToBuy : 0,
        foodCansToBuy: type.includes("umida") ? foodCansToBuy : 0,
        foodNaturalKg: type === "natural" ? foodNaturalKg : 0,
        frequencyOfBuying,
    };
};
exports.calculateFoodNeeds = calculateFoodNeeds;
