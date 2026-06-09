import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

function ScheduleCalendar() {
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      title: "골조 공사",
      start: "2026-06-10",
      end: "2026-06-25",
    },
  ];

  return (
    <div className="schedule-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="800px"
        />
      </div>
    </div>
  );
}

export default ScheduleCalendar;
