"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatVaccineData = exports.calculateVaccineNeeds = void 0;
const calculateVaccineNeeds = (vaccines, duration_default_days = 30 // fallback caso o usuário não forneça
) => {
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
exports.calculateVaccineNeeds = calculateVaccineNeeds;
const formatVaccineData = (vaccines) => {
    return vaccines.map((vaccine) => (Object.assign(Object.assign({}, vaccine), { date_administered: vaccine.date_administered
            ? new Date(vaccine.date_administered).toISOString().split("T")[0]
            : null })));
};
exports.formatVaccineData = formatVaccineData;
