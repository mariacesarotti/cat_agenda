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
exports.createCalendarEvent = exports.getCalendarEventsByUser = void 0;
const pool_1 = require("../../db/pool");
const calendar_service_1 = require("../../services/calendar.service");
const getCalendarEventsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id, 10);
        const events = yield (0, calendar_service_1.getUserCalendarEvents)(userId);
        res.status(200).json(events); // ✅ sem "return"
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar eventos" });
    }
});
exports.getCalendarEventsByUser = getCalendarEventsByUser;
const createCalendarEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, start, end, description } = req.body;
    const user_id = req.user.id;
    if (!user_id)
        res.status(400).json({ error: "Usuário não identificado." });
    try {
        const event = yield pool_1.pool.query("INSERT INTO calendar_events (title, start, end, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", [title, start, end, description, user_id]);
        res.status(201).json(event.rows[0]);
    }
    catch (error) {
        console.error("Error creating calendar event:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.createCalendarEvent = createCalendarEvent;
