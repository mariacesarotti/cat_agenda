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
exports.calculateVaccine = exports.deleteVaccineConfig = exports.updateVaccineConfig = exports.getVaccinesByCatId = exports.getVaccines = exports.createVaccineConfig = void 0;
const pool_1 = require("../../db/pool");
const vaccines_service_1 = require("../../services/vaccines.service");
const createVaccineConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id } = req.body;
    const { vaccine_name, date_administered, description, frequency_days } = req.body;
    try {
        const result = yield pool_1.pool.query("INSERT INTO vaccines (cat_id, vaccine_name, date_administered, description, frequency_days) VALUES ($1, $2, $3, $4, $5) RETURNING *", [cat_id, vaccine_name, date_administered, description, frequency_days]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao adicionar vacina:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.createVaccineConfig = createVaccineConfig;
const getVaccines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM vaccines WHERE cat_id = $1", [cat_id]);
        if (result.rows.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma vacina encontrada para este gato." });
            return;
        }
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar vacinas:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getVaccines = getVaccines;
const getVaccinesByCatId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM vaccines WHERE cat_id = $1", [cat_id]);
        if (result.rows.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma vacina encontrada para este gato." });
            return;
        }
        const formatted = result.rows.map((vaccine) => (Object.assign(Object.assign({}, vaccine), { date_administered: vaccine.date_administered
                ? new Date(vaccine.date_administered).toISOString().split("T")[0]
                : null })));
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar vacinas:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getVaccinesByCatId = getVaccinesByCatId;
const updateVaccineConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { vaccine_name, date_administered, description } = req.body;
    try {
        const result = yield pool_1.pool.query("UPDATE vaccines SET vaccine_name = $1, date_administered = $2, description = $3 WHERE id = $4 RETURNING *", [vaccine_name, date_administered, description, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Vacina não encontrada" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar vacina:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.updateVaccineConfig = updateVaccineConfig;
const deleteVaccineConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield pool_1.pool.query("DELETE FROM vaccines WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Vacina não encontrada" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao deletar vacina:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteVaccineConfig = deleteVaccineConfig;
const calculateVaccine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cat_id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM vaccines WHERE cat_id = $1", [cat_id]);
        if (result.rows.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma vacina encontrada para este gato." });
            return;
        }
        const config = result.rows;
        if (!config || config.length === 0) {
            res
                .status(404)
                .json({ error: "Configuração de vacina não encontrada!" });
            return;
        }
        const calc = (0, vaccines_service_1.calculateVaccineNeeds)(config);
        res.status(200).json(calc);
    }
    catch (error) {
        console.error("Erro ao calcular vacina:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.calculateVaccine = calculateVaccine;
