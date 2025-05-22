"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const express_1 = require("express");
const calendar_controller_1 = require("../controllers/calendar/calendar.controller");
const router = (0, express_1.Router)();
router.get("/:id", auth_1.authenticateToken, calendar_controller_1.getCalendarEventsByUser);
exports.default = router;
