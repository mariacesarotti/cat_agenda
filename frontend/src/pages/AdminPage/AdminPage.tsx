/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getCalendarEvents } from "../../api/catCalendarApi";
import CalendarSection from "../../components/CalendarSection/CalendarSection";
import { useNavigate } from "react-router-dom";
import "./AdminPage.scss";
interface CalendarEvent {
  date: string;
  type: string;
  cat: string;
  description: string;
}

export const AdminPage = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const events: any[] = await getCalendarEvents(); // função customizada correta
        const calendarEvents: CalendarEvent[] = events.map((event: any) => ({
          date: event.date,
          type: event.type,
          cat: event.cat,
          description: event.description,
        }));
        setCalendarEvents(calendarEvents);
      } catch (err: any) {
        console.error("Erro ao carregar eventos do calendário:", err);
        setError(err.message || "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  if (loading)
    return <p className="admin-status">the cats are calculating...</p>;
  if (error)
    return <p className="admin-status">hmm. something went wrong: {error}</p>;

  return (
    <section className="admin-page-container">
      <nav className="admin-nav">
        <ul>
          <li>
            <a href="/">↩ home</a>
          </li>
          <li>
            <button onClick={handleLogout}>log out</button>
          </li>
        </ul>
      </nav>
      <CalendarSection events={calendarEvents} />
    </section>
  );
};
