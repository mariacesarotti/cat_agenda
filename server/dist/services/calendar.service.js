"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCalendarEvents = void 0;
const pool_1 = require("../db/pool");
const generateRecurringDates_1 = require("../utils/generateRecurringDates");
const format_1 = require("../utils/format");
const food_service_1 = require("./food.service");
const medication_service_1 = require("../services/medication.service");
const litter_service_1 = require("../services/litter.service");
const getUserCalendarEvents = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const events = [];
    // 1. Buscar gatos do usuário
    const catsResult = yield pool_1.pool.query("SELECT id, name, age_category FROM cats WHERE user_id = $1", [user_id]);
    const cats = catsResult.rows;
    // 2. Iterar por gato
    for (const cat of cats) {
        const catId = cat.id;
        // === Medications ===
        const medsResult = yield pool_1.pool.query("SELECT * FROM medications WHERE cat_id = $1", [catId]);
        const medConfig = medsResult.rows.map((med) => ({
            cat_id: catId,
            med_name: med.med_name,
            dosage: med.dosage,
            start_date: med.start_date,
            frequency_days: med.frequency_days,
            duration_days: med.duration_days,
        }));
        const medicationSchedule = (0, medication_service_1.calculateMedicationNeeds)(medConfig);
        medicationSchedule.forEach((item) => {
            events.push({
                date: item.start_date,
                type: "medication",
                cat: cat.name,
                description: `Tomar ${item.med_name} (${item.dosage})`,
            });
            // Caso queira adicionar a data final também:
            events.push({
                date: item.end_date,
                type: "medication",
                cat: cat.name,
                description: `Fim da medicação (${item.med_name})`,
            });
        });
        // === Foods ===
        const foods = yield pool_1.pool.query("SELECT brand, type, start_date FROM foods WHERE cat_id = $1", [catId]);
        foods.rows.forEach((food) => {
            const calc = (0, food_service_1.calculateFoodNeeds)({
                age_category: cat.age_category,
                type: food.type,
                num_of_cats: 1,
            });
            const dates = (0, generateRecurringDates_1.generateRecurringDates)(food.start_date, calc.frequencyOfBuying, 90);
            dates.forEach((date) => {
                var _a, _b;
                events.push({
                    date: (_a = (0, format_1.formatDate)(date)) !== null && _a !== void 0 ? _a : date,
                    type: "food",
                    cat: cat.name,
                    description: `Reposição de ração (${food.brand})`,
                });
                const purchaseDate = new Date(date);
                purchaseDate.setDate(purchaseDate.getDate() - 5);
                let quantityDesc = "";
                if (calc.foodBagsToBuy)
                    quantityDesc += `${calc.foodBagsToBuy} saco(s) de 4kg `;
                if (calc.foodCansToBuy)
                    quantityDesc += `${calc.foodCansToBuy} lata(s) `;
                if (calc.foodNaturalKg)
                    quantityDesc += `${calc.foodNaturalKg}kg natural`;
                events.push({
                    date: (_b = (0, format_1.formatDate)(purchaseDate)) !== null && _b !== void 0 ? _b : purchaseDate,
                    type: "food_purchase",
                    cat: "",
                    description: `Comprar comida para ${cat.name}: ${quantityDesc.trim()}`,
                });
            });
        });
        // === Vaccines === (lógica básica, você pode expandir depois)
        const vaccines = yield pool_1.pool.query("SELECT vaccine_name, date_administered FROM vaccines WHERE cat_id = $1", [catId]);
        vaccines.rows.forEach((vaccine) => {
            const dates = (0, generateRecurringDates_1.generateRecurringDates)(vaccine.date_administered, 365, 365);
            dates.forEach((date) => {
                var _a, _b;
                const vaccineName = (_a = vaccine.vaccine_name) !== null && _a !== void 0 ? _a : "sem nome";
                events.push({
                    date: (_b = (0, format_1.formatDate)(date)) !== null && _b !== void 0 ? _b : date,
                    type: "vaccine",
                    cat: cat.name,
                    description: `Vacinação (${vaccineName})`,
                });
            });
        });
    }
    // 3. Litter config (por usuário)
    const litterResult = yield pool_1.pool.query("SELECT * FROM litter_config WHERE user_id = $1", [user_id]);
    if (litterResult.rows.length > 0) {
        const litter = litterResult.rows[0];
        const litterCalc = (0, litter_service_1.calculateLitterNeeds)({
            type_of_litter: litter.type_of_litter,
            num_of_cats: litter.num_of_cats,
            num_of_boxes: litter.num_of_boxes,
        });
        const dates = (0, generateRecurringDates_1.generateRecurringDates)(litter.last_full_change, litterCalc.fullChangeFrequencyDays, 90);
        dates.forEach((date) => {
            var _a, _b;
            events.push({
                date: (_a = (0, format_1.formatDate)(date)) !== null && _a !== void 0 ? _a : date,
                type: "litter",
                cat: "",
                description: `Troca completa da areia (${litter.type_of_litter})`,
            });
            const purchaseDate = new Date(date);
            purchaseDate.setDate(purchaseDate.getDate() - 5);
            events.push({
                date: (_b = (0, format_1.formatDate)(purchaseDate)) !== null && _b !== void 0 ? _b : purchaseDate,
                type: "litter_purchase",
                cat: "",
                description: `Comprar ${litterCalc.litterBagsToBuy} saco(s) de areia (4kg)`
            });
        });
    }
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});
exports.getUserCalendarEvents = getUserCalendarEvents;
