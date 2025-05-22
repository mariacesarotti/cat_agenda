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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getUserById = exports.getUsers = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pool_1 = require("../../db/pool");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const result = yield pool_1.pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword]);
        const user = result.rows[0];
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            token,
            user: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email,
            },
        });
    }
    catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ error: "Usuário não encontrado." });
        }
        console.log("📦 Senha salva no banco:", user.password);
        console.log("🔐 Senha enviada pelo usuário:", password);
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: "Senha incorreta." });
        }
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, secret, { expiresIn: "7d" });
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.loginUser = loginUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool_1.pool.query("SELECT * FROM users");
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield pool_1.pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "usuário não encontrado!" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getUserById = getUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield pool_1.pool.query("DELETE FROM users WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: "usuário não encontrado!" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const result = yield pool_1.pool.query("UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *", [name, email, hashedPassword, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "usuário não encontrado!" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.updateUser = updateUser;
