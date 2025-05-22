import { pool } from "../db/pool";
import { generateRecurringDates } from "../utils/generateRecurringDates";
import { formatDate } from "../utils/format";
import { calculateFoodNeeds } from "./food.service";
import { calculateMedicationNeeds } from "../services/medication.service";
import { calculateLitterNeeds } from "../services/litter.service";

export const getUserCalendarEvents = async (user_id: number) => {
  try {
  const events: {
    date: string;
    type: string;
    cat: string;
    description: string;
  }[] = [];

  // Buscar gatos do usuário
  const catsResult = await pool.query(
    "SELECT id, name, age_category FROM cats WHERE user_id = $1",
    [user_id]
  );
  const cats = catsResult.rows;

  for (const cat of cats) {
    const catId = cat.id;

    // === Medications ===
    const medsResult = await pool.query(
      "SELECT * FROM medications WHERE cat_id = $1",
      [catId]
    );

    const medConfig = medsResult.rows
      .filter((med) => isValidDate(med.start_date))
      .map((med) => ({
        cat_id: catId,
        med_name: med.med_name,
        dosage: med.dosage,
        start_date: new Date(med.start_date),
        frequency_days: med.frequency_days,
        duration_days: med.duration_days,
      }));

    const medicationSchedule = calculateMedicationNeeds(medConfig);

    medicationSchedule.forEach((item) => {
      if (isValidDate(item.start_date)) {
        events.push({
          date: formatDate(item.start_date) ?? "",
          type: "medication",
          cat: cat.name,
          description: `Tomar ${item.med_name} (${item.dosage})`,
        });
      }
      if (isValidDate(item.end_date)) {
        events.push({
          date: formatDate(item.end_date) ?? "",
          type: "medication",
          cat: cat.name,
          description: `Fim da medicação (${item.med_name})`,
        });
      }
    });

    // === Foods ===
    const foods = await pool.query(
      "SELECT brand, type, start_date FROM foods WHERE cat_id = $1",
      [catId]
    );

    foods.rows
      .filter((food) => isValidDate(food.start_date))
      .forEach((food) => {
        const calc = calculateFoodNeeds({
          age_category: cat.age_category,
          type: food.type,
          num_of_cats: 1,
        });

        const dates = generateRecurringDates(
          food.start_date,
          calc.frequencyOfBuying,
          90
        );

        dates.forEach((date) => {
          const formattedDate = formatDate(date);
          const purchaseDate = new Date(date);
          purchaseDate.setDate(purchaseDate.getDate() - 5);

          let quantityDesc = "";
          if (calc.foodBagsToBuy) quantityDesc += `${calc.foodBagsToBuy} saco(s) de 4kg `;
          if (calc.foodCansToBuy) quantityDesc += `${calc.foodCansToBuy} lata(s) `;
          if (calc.foodNaturalKg) quantityDesc += `${calc.foodNaturalKg}kg natural`;

          if (isValidDate(date)) {
            events.push({
              date: formattedDate ?? "",
              type: "food",
              cat: cat.name,
              description: `Reposição de ração (${food.brand})`,
            });
          }

          if (isValidDate(purchaseDate)) {
            events.push({
              date: formatDate(purchaseDate) ?? "",
              type: "food_purchase",
              cat: "",
              description: `Comprar comida para ${cat.name}: ${quantityDesc.trim()}`,
            });
          }
        });
      });

    // === Vaccines ===
    const vaccines = await pool.query(
      "SELECT vaccine_name, date_administered FROM vaccines WHERE cat_id = $1",
      [catId]
    );

    vaccines.rows
      .filter((vaccine) => isValidDate(vaccine.date_administered))
      .forEach((vaccine) => {
        const dates = generateRecurringDates(vaccine.date_administered, 365, 365);
        const vaccineName = vaccine.vaccine_name ?? "sem nome";

        dates.forEach((date) => {
          if (isValidDate(date)) {
            events.push({
              date: formatDate(date) ?? "",
              type: "vaccine",
              cat: cat.name,
              description: `Vacinação (${vaccineName})`,
            });
          }
        });
      });
  }

  // === Litter config ===
  const litterResult = await pool.query(
    "SELECT * FROM litter_config WHERE user_id = $1",
    [user_id]
  );

  if (
    litterResult.rows.length > 0 &&
    isValidDate(litterResult.rows[0].last_full_change)
  ) {
    const litter = litterResult.rows[0];
    const litterCalc = calculateLitterNeeds({
      type_of_litter: litter.type_of_litter,
      num_of_cats: litter.num_of_cats,
      num_of_boxes: litter.num_of_boxes,
    });

    const dates = generateRecurringDates(
      litter.last_full_change,
      litterCalc.fullChangeFrequencyDays,
      90
    );

    dates.forEach((date) => {
      const formattedDate = formatDate(date);
      const purchaseDate = new Date(date);
      purchaseDate.setDate(purchaseDate.getDate() - 5);

      if (isValidDate(date)) {
        events.push({
          date: formattedDate ?? "",
          type: "litter",
          cat: "",
          description: `Troca completa da areia (${litter.type_of_litter})`,
        });
      }

      if (isValidDate(purchaseDate)) {
        events.push({
          date: formatDate(purchaseDate) ?? "",
          type: "litter_purchase",
          cat: "",
          description: `Comprar ${litterCalc.litterBagsToBuy} saco(s) de areia (4kg)`,
        });
      }
    });
  }

  return events
    .filter((e) => isValidDate(e.date)) // remove datas inválidas
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
} catch (error) {
  console.error("Erro ao buscar eventos do calendário:", error);
  throw new Error("Erro ao buscar eventos do calendário");  
};
};

// Utilitário seguro para checar se é uma data válida
function isValidDate(date: any): boolean {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}
