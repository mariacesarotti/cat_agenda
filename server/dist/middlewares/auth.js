"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
    if (process.env.AUTH_ENABLED === "false") {
        // Se auth estiver desativada, pula direto pro controller
        console.log("🔓 Autenticação desativada para ambiente de desenvolvimento.");
        req.user = { id: 1, name: "Dev User", email: "devuser@example.com" }; // Simulação de login
        return next();
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Token não fornecido." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ error: "Token inválido." });
    }
};
exports.authenticateToken = authenticateToken;
