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
exports.updateCat = exports.deleteCat = exports.getCatById = exports.getCats = exports.getCatsByUserId = exports.createCat = void 0;
const pool_1 = require("../../db/pool");
const createCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, age_category } = req.body;
        const user_id = req.user.id; // <-- PEGA do token!
        const result = yield pool_1.pool.query("INSERT INTO cats (name, age_category, user_id) VALUES ($1, $2, $3) RETURNING *", [name, age_category, user_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao criar gato:", error);
        res.status(500).json({ error: "Erro ao criar gato" });
    }
});
exports.createCat = createCat;
const getCatsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log("Header Authorization recebido:", req.headers["authorization"]);
    console.log("ID do usuário recebido:", userId);
    console.log("ID do usuário recebido:", req.user.id);
    try {
        const result = yield pool_1.pool.query("SELECT * FROM cats WHERE user_id = $1", [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar gatos do usuário:", error);
        res.status(500).json({ error: "Erro ao buscar gatos do usuário" });
    }
});
exports.getCatsByUserId = getCatsByUserId;
const getCats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM cats WHERE user_id = $1", [
            user.id
        ]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching cats:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getCats = getCats;
const getCatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM cats WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "gato não encontrado!" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error fetching cat:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getCatById = getCatById;
const deleteCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield pool_1.pool.query("DELETE FROM cats WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Gato não encontrado" });
            return;
        }
        res
            .status(200)
            .json({ message: "Gato removido com sucesso", deleted: result.rows[0] });
    }
    catch (error) {
        console.error("Erro ao deletar gato:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteCat = deleteCat;
const updateCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    UPDATE cats
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;
    values.push(id);
    try {
        const result = yield pool_1.pool.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Gato não encontrado" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar gato:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.updateCat = updateCat;
