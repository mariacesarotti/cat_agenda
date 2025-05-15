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
exports.calculateMedication = exports.deleteMedicationConfig = exports.getMedicationConfigByCatId = exports.getMedicationConfigByUser = exports.getMedicationConfig = exports.updateMedicationConfig = exports.createMedicationConfig = void 0;
const pool_1 = require("../../db/pool");
const medication_service_1 = require("../../services/medication.service");
const createMedicationConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id, med_name, dosage, frequency_days, start_date } = req.body;
    try {
        const result = yield pool_1.pool.query("INSERT INTO medications (cat_id, med_name, dosage, frequency_days, start_date) VALUES ($1, $2, $3, $4, $5) RETURNING *", [cat_id, med_name, dosage, frequency_days, start_date]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro criando configuração de medicação:", error);
        res.status(200).json({ error: error.message });
    }
});
exports.createMedicationConfig = createMedicationConfig;
const updateMedicationConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
      UPDATE medications
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `;
    values.push(id);
    try {
        const result = yield pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Medicação não encontrada" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar medicação:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.updateMedicationConfig = updateMedicationConfig;
const getMedicationConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const result = yield pool_1.pool.query(`SELECT m.* FROM medications m
       JOIN cats c ON m.cat_id = c.id
       WHERE c.user_id = $1`, [user.id]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar medicações:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getMedicationConfig = getMedicationConfig;
const getMedicationConfigByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { cat_id } = req.params;
    try {
        const result = yield pool_1.pool.query(`SELECT m.* FROM medications m
       JOIN cats c ON m.cat_id = c.id
       WHERE c.user_id = $1 AND m.cat_id = $2`, [user.id, cat_id]);
        if (result.rows.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma medicação encontrada para este gato." });
            return;
        }
        const formatted = result.rows.map((med) => (Object.assign(Object.assign({}, med), { start_date: med.start_date
                ? new Date(med.start_date).toISOString().split("T")[0]
                : null, end_date: med.end_date
                ? new Date(med.end_date).toISOString().split("T")[0]
                : null })));
        res.status(200).json(formatted);
    }
    catch (error) {
        console.error("Erro ao buscar medicações:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getMedicationConfigByUser = getMedicationConfigByUser;
const getMedicationConfigByCatId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM medications WHERE cat_id = $1", [cat_id]);
        if (result.rows.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma medicação encontrada para este gato." });
            return;
        }
        const formatted = result.rows.map((med) => (Object.assign(Object.assign({}, med), { start_date: med.start_date
                ? new Date(med.start_date).toISOString().split("T")[0]
                : null, end_date: med.end_date
                ? new Date(med.end_date).toISOString().split("T")[0]
                : null })));
        res.status(200).json(formatted);
    }
    catch (error) {
        console.error("Erro ao buscar medicações:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getMedicationConfigByCatId = getMedicationConfigByCatId;
const deleteMedicationConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield pool_1.pool.query("DELETE FROM medications WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Medicação não encontrada" });
            return;
        }
        res.status(200).json({
            message: "Medicação removida com sucesso",
            deleted: result.rows[0],
        });
    }
    catch (error) {
        console.error("Erro ao deletar medicação:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteMedicationConfig = deleteMedicationConfig;
const calculateMedication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM medications WHERE cat_id = $1", [cat_id]);
        if (result.rows.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma medicação encontrada para este gato." });
            return;
        }
        const config = result.rows;
        if (!config || config.length === 0) {
            res
                .status(404)
                .json({ error: "Configuração de medicação não encontrada!" });
            return;
        }
        const calc = (0, medication_service_1.calculateMedicationNeeds)(config);
        res.status(200).json(calc);
    }
    catch (error) {
        console.error("Erro ao calcular medicação:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.calculateMedication = calculateMedication;
