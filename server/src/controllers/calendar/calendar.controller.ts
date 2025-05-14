import { Request, Response } from "express";
import { pool } from "../../db/pool";
import { getUserCalendarEvents } from "../../services/calendar.service";


export const getCalendarEventsByUser = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        const events = await getUserCalendarEvents(Number(user.id));
        res.status(200).json(events);
    } catch (error: any) {
        console.error("Error fetching calendar events:", error);
        res.status(500).json({ error: error.message });
    }
    }
