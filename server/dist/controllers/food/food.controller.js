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
exports.getFoodCalculation = exports.getFoodConfigByUser = exports.updateFoodConfig = exports.createFoodConfig = void 0;
const pool_1 = require("../../db/pool");
const food_service_1 = require("../../services/food.service");
const createFoodConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id, brand, type, start_date } = req.body;
    try {
        const result = yield pool_1.pool.query("INSERT INTO foods (cat_id, brand, type, start_date) VALUES ($1, $2, $3, $4) RETURNING *", [cat_id, brand, type, start_date]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error creating foods config:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.createFoodConfig = createFoodConfig;
const updateFoodConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updates = req.body;
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in updates) {
        fields.push(`${key} = $${index}`);
        values.push(updates[key]);
        index++;
    }
    if (fields.length === 0) {
        res.status(400).json({ error: "Nenhum campo fornecido para atualização." });
        return;
    }
    const query = `
    UPDATE foods
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;
    values.push(id);
    try {
        const result = yield pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Configuração de ração não encontrada!" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar configuração de ração:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.updateFoodConfig = updateFoodConfig;
const getFoodConfigByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM foods WHERE cat_id IN (SELECT id FROM cats WHERE user_id = $1)", [user.id]);
        const formatted = result.rows.map((food) => (Object.assign(Object.assign({}, food), { start_date: food.start_date
                ? new Date(food.start_date).toISOString().split("T")[0]
                : null, end_date: food.end_date
                ? new Date(food.end_date).toISOString().split("T")[0]
                : null })));
        res.status(200).json(formatted);
    }
    catch (error) {
        console.error("Error fetching food config:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getFoodConfigByUser = getFoodConfigByUser;
const getFoodCalculation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const result = yield pool_1.pool.query(`SELECT f.*, c.age_category 
       FROM foods f
       JOIN cats c ON f.cat_id = c.id
       WHERE c.user_id = $1`, [user.id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Nenhuma configuração de ração encontrada!" });
            return;
        }
        const calculations = result.rows.map((config) => (0, food_service_1.calculateFoodNeeds)({
            age_category: config.age_category,
            type: config.type,
            num_of_cats: 1 // cada ração corresponde a um gato, então 1 por vez
        }));
        res.status(200).json(calculations);
    }
    catch (error) {
        console.error("Erro ao calcular necessidades de comida:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getFoodCalculation = getFoodCalculation;
