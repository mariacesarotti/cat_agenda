interface FoodCalculationInput {
    age_category: string;
    type: string
    num_of_cats: number;
}

interface FoodCalculationOutput {
    foodKgPerMonth: number;
    foodBagsToBuy: number;
    frequencyOfBuying: number;
    foodCansToBuy: number;
    foodNaturalKg: number;
}
export const calculateFoodNeeds = ({
  age_category,
  type,
  num_of_cats,
}: FoodCalculationInput): FoodCalculationOutput => {
  const diasNoMes = 30;
  const pesoMedio = 5;

  // Defensive: defaults
  const safeType = (type || "").toLowerCase();
  const safeAge = (age_category || "").toLowerCase();
  const cats = Number(num_of_cats) > 0 ? Number(num_of_cats) : 1;

  let diariaSeca = 0;
  let diariaUmida = 0;
  let diariaNatural = 0;

  switch (safeType) {
    case "seca":
      diariaSeca = safeAge === "filhote" ? pesoMedio * 20 : pesoMedio * 25;
      break;
    case "umida":
      diariaUmida = (pesoMedio * 85) / 1.5;
      break;
    case "seca+umida":
      diariaSeca = pesoMedio * 15;
      diariaUmida = pesoMedio * 50;
      break;
    case "natural":
      diariaNatural = safeAge === "filhote" ? 400 : pesoMedio * 150;
      break;
  }

  const monthlySeca = diariaSeca * diasNoMes * cats;
  const monthlyUmida = diariaUmida * diasNoMes * cats;
  const monthlyNatural = diariaNatural * diasNoMes * cats;

  const foodBagsToBuy = Math.ceil(monthlySeca / 4000);
  const foodCansToBuy = Math.ceil(monthlyUmida / 85);
  const foodNaturalKg = Math.ceil(monthlyNatural / 1000);

  const frequencyOfBuying = safeType === "seca+umida" ? 20 : 30;

  return {
    foodKgPerMonth: (monthlySeca + monthlyUmida + monthlyNatural) / 1000,
    foodBagsToBuy: safeType.includes("seca") ? foodBagsToBuy : 0,
    foodCansToBuy: safeType.includes("umida") ? foodCansToBuy : 0,
    foodNaturalKg: safeType === "natural" ? foodNaturalKg : 0,
    frequencyOfBuying,
  };
};
