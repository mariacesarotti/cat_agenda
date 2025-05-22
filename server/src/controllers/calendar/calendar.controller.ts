import { Request, Response } from "express";
import { pool } from "../../db/pool";
import { getUserCalendarEvents } from "../../services/calendar.service";

export const getCalendarEventsByUser = async (req: Request, res: Response) => {
  const user_id = req.params;

  if (!user_id) res.status(400).json({ error: "Usuário não identificado." });

  try {
    const events = await getUserCalendarEvents(Number(user_id));
    res.status(200).json(events);
  } catch (error: any) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: error.message });
  }
};
export const createCalendarEvent = async (req: Request, res: Response) => {
  const { title, start, end, description } = req.body;
  const user_id = (req as any).user.id;

  if (!user_id)
    res.status(400).json({ error: "Usuário não identificado." });

  try {
    const event = await pool.query(
      "INSERT INTO calendar_events (title, start, end, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, start, end, description, user_id]
    );
    res.status(201).json(event.rows[0]);
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    res.status(500).json({ error: error.message });
  }
};
