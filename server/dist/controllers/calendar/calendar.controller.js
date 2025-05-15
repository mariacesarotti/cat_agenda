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
exports.getCalendarEventsByUser = void 0;
const calendar_service_1 = require("../../services/calendar.service");
const getCalendarEventsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const events = yield (0, calendar_service_1.getUserCalendarEvents)(Number(user.id));
        res.status(200).json(events);
    }
    catch (error) {
        console.error("Error fetching calendar events:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getCalendarEventsByUser = getCalendarEventsByUser;
