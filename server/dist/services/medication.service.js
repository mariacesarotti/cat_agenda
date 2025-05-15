"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMedicationNeeds = void 0;
const calculateMedicationNeeds = (medications, duration_default_days = 30 // fallback caso o usuário não forneça
) => {
    return medications.map((med) => {
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
exports.calculateMedicationNeeds = calculateMedicationNeeds;
