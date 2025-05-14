interface VaccineCalculationInput {
  vaccine_name: string;
  cat_id: number;
  date_administered: Date;
  frequency_days: number;
}

interface VaccineCalculationOutput {
  cat_id: number;
  vaccine_name: string;
  frequency: number;
  date_administered: string;
  next_due_date: string;
}

export const calculateVaccineNeeds = (
  vaccines: VaccineCalculationInput[],
  duration_default_days = 30 // fallback caso o usuário não forneça
): VaccineCalculationOutput[] => {
  return vaccines.map((vac) => {
    const dateAdministered = new Date(vac.date_administered);
    const frequency = vac.frequency_days;
    const catId = vac.cat_id;
    const nextVaccineDate = new Date(dateAdministered);
    nextVaccineDate.setDate(dateAdministered.getDate() + frequency);

    return {
      vaccine_name: vac.vaccine_name,
      cat_id: catId,
      frequency: frequency,
      date_administered: dateAdministered.toISOString().split("T")[0],
      next_due_date: nextVaccineDate.toISOString().split("T")[0],
    };
  });
};
export const formatVaccineData = (vaccines: any[]) => {
  return vaccines.map((vaccine) => ({
    ...vaccine,
    date_administered: vaccine.date_administered
      ? new Date(vaccine.date_administered).toISOString().split("T")[0]
      : null,
  }));
};
