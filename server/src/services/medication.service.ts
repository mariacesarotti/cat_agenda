interface MedicationCalculationInput {
  med_name: string;
  dosage: string;
  cat_id: number;
  start_date: Date | string;
  frequency_days: number;
  duration_days?: number; // opcional para cálculo mais avançado
}

interface MedicationCalculationOutput {
  cat_id: number;
  med_name: string;
  dosage: string;
  frequency: number;
  start_date: string;
  end_date: string;
}

export const calculateMedicationNeeds = (
  medications: MedicationCalculationInput[],
  duration_default_days = 30 // fallback caso o usuário não forneça
): MedicationCalculationOutput[] => {
  return medications
    .filter((med) => med.start_date && !isNaN(new Date(med.start_date).getTime()))
    .map((med) => {
      const startDate = new Date(med.start_date);
      const duration = med.duration_days || duration_default_days;
      const endDate = new Date(startDate);
      const catId = med.cat_id;
      endDate.setDate(startDate.getDate() + duration);

      return {
        med_name: med.med_name,
        dosage: med.dosage,
        cat_id: catId,
        frequency: med.frequency_days,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
      };
    });
};
