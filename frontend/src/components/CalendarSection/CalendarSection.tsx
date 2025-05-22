/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, NavigateAction } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ptBR } from "date-fns/locale/pt-BR";
import "./CalendarSection.scss";
interface Event {
  date: string;
  type: string;
  cat: string;
  description: string;
}

interface CalendarSectionProps {
  events: Event[];
}

// Configuração de locais
const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Função para transformar seus eventos em eventos do calendário
interface TransformedEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: string;
}

const transformEvents = (events: Event[]): TransformedEvent[] => {
  return events.map((event) => {
    let title = "";

    switch (event.type) {
      case "food":
        title = `Repor ração para ${event.cat}`;
        break;
      case "food_purchase":
        title = `Compra de comida (${event.description})`;
        break;
      case "litter":
        title = `Trocar areia (${event.description.split("(")[1] || ""}`;
        break;
      case "litter_purchase":
        title = `Comprar areia (${
          event.description.split(":")[1]?.trim() || ""
        })`;
        break;
      case "medication":
        title = `Hora do remédio – ${event.cat}`;
        break;
      case "vaccine":
        title = `Vacina agendada – ${event.cat}`;
        break;
      default:
        title = `${capitalize(event.type)} - ${event.cat}: ${
          event.description
        }`;
    }
    title.toLowerCase();
    return {
      title,
      start: new Date(event.date),
      end: new Date(event.date),
      allDay: true,
      type: event.type,
      cat: event.cat,
      description: event.description,
    };
  });
};

const generateGoogleCalendarLink = (event: any) => {
  const startDate = new Date(event.start)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
  const endDate = new Date(event.end)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    event.description
  )}`;
};

// Função para lidar com o clique em um evento
const handleSelectEvent = (event: any) => {
  if (
    window.confirm(`Detalhes do Evento:
  Tipo: ${event.type}
  Gato: ${event.cat || "Não especificado"}
  Descrição: ${event.description}
  Data: ${event.start.toLocaleDateString()}

  Deseja adicionar este evento ao Google Calendar?`)
  ) {
    window.open(generateGoogleCalendarLink(event), "_blank");
  }
};
const eventStyleGetter = (event: TransformedEvent) => {
  const safeTitle = event.title?.toLowerCase() || "";
  let backgroundColor = "";

  // Definição das cores por tipo ou por conteúdo do título
  if (event.type === "litter") {
    backgroundColor = "#FFD700"; // Amarelo para troca de areia
  } else if (event.type === "litter_purchase") {
    backgroundColor = "#FFA500"; // Laranja para compra de areia
  } else if (event.type === "food") {
    backgroundColor = "#90EE90"; // Verde claro para alimentação
  } else if (event.type === "food_purchase") {
    backgroundColor = "#6B8E23"; // Verde escuro para compra de comida
  } else if (event.type === "medication") {
    backgroundColor = "#FF7F7F"; // Rosa para medicação
  } else if (event.type === "vaccine") {
    backgroundColor = "#87CEEB"; // Azul claro para vacina
  } else if (safeTitle.includes("food")) {
    backgroundColor = "#C0FFBA"; // fallback se "food" aparecer no título
  } else {
    backgroundColor = "#D3D3D3"; // Cinza para qualquer outro tipo
  }

  return {
    style: {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "black",
      border: "0px",
      display: "block",
      padding: "2px",
    },
  };
};


const CalendarSection: React.FC<CalendarSectionProps> = ({ events }) => {
  const calendarEvents = transformEvents(events);
  const [currentDate, setCurrentDate] = useState(new Date()); // Controle manual da data

  const handleNavigate = (
    newDate: Date,
    _view: string,
    action: NavigateAction
  ) => {
    if (action === "NEXT" || action === "PREV" || action === "TODAY") {
      setCurrentDate(newDate);
    }
  };

  return (
    <section className="calendar-container">
      <h2 className="calendar-title">Calendário de Cuidados</h2>
      <div className="calendar-section-content">
        <Calendar
          localizer={localizer}
          eventPropGetter={eventStyleGetter}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          date={currentDate} // Controlando a data
          onNavigate={handleNavigate} // Atualiza a data ao clicar nos botões
          onSelectEvent={handleSelectEvent}
          views={["month"]}
          popup
          messages={{
            today: "Hoje",
            previous: "Anterior",
            next: "Próximo",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Nenhum evento neste período.",
          }}
          style={{
            height: "100%",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "1rem",
          }}
        />
      </div>
    </section>
  );
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default CalendarSection;
