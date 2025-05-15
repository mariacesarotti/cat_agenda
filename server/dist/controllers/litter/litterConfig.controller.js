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
exports.getAllLitterConfigs = exports.getLitterCalculation = exports.getLitterConfigByUser = exports.updateLitterConfig = exports.createLitterConfig = void 0;
const pool_1 = require("../../db/pool");
const litter_service_1 = require("../../services/litter.service");
const createLitterConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { type_of_litter, num_of_cats, num_of_boxes, last_full_change, } = req.body;
    try {
        const result = yield pool_1.pool.query("INSERT INTO litter_config (user_id, type_of_litter, num_of_cats, num_of_boxes, last_full_change) VALUES ($1, $2, $3, $4, $5) RETURNING *", [user.id, type_of_litter, num_of_cats, num_of_boxes, last_full_change]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error creating litter config:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.createLitterConfig = createLitterConfig;
const updateLitterConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    UPDATE litter_config
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;
    values.push(id);
    try {
        const result = yield pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Configuração não encontrada." });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar configuração:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.updateLitterConfig = updateLitterConfig;
const getLitterConfigByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM litter_config WHERE user_id = $1", [user.id]);
        if (result.rows.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma configuração encontrada para este usuário!" });
            return;
        }
        const config = result.rows[0];
        const formatted = {
            id: config.id,
            user_id: config.user_id,
            type_of_litter: config.type_of_litter,
            num_of_cats: config.num_of_cats,
            num_of_boxes: config.num_of_boxes,
            last_full_change: new Date(config.last_full_change).toISOString().split("T")[0]
        };
        res.status(200).json(formatted);
    }
    catch (error) {
        console.error("Erro ao buscar configuração de areia:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getLitterConfigByUser = getLitterConfigByUser;
const getLitterCalculation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM litter_config WHERE user_id = $1", [user_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "nenhuma configuracao encontrada" });
            return;
        }
        const config = result.rows[0];
        const calc = (0, litter_service_1.calculateLitterNeeds)({
            type_of_litter: config.type_of_litter,
            num_of_cats: config.num_of_cats,
            num_of_boxes: config.num_of_boxes,
        });
        res.status(200).json(calc);
    }
    catch (error) {
        console.error("Erro ao calcular necessidades de areia:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getLitterCalculation = getLitterCalculation;
const getAllLitterConfigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool_1.pool.query("SELECT * FROM litter_config");
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar todas as configurações de areia:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getAllLitterConfigs = getAllLitterConfigs;
