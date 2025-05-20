import { authenticateToken } from "../middlewares/auth";
import { Router } from "express";
import { getCalendarEventsByUser } from "../controllers/calendar/calendar.controller";

const router = Router();

router.get("/:id", authenticateToken, getCalendarEventsByUser);

export default router;
