import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";
import "../../styles/SchedulePage.css";

function SchedulePage() {
  const navigate = useNavigate();

  const events = [
    {
      title: "강남 오피스 신축",
      date: "2026-06-15",
      className: "schedule-event-site",
    },
    {
      title: "송도 아파트 공사",
      date: "2026-06-20",
      className: "schedule-event-site",
    },
    {
      title: "자재 입고",
      date: "2026-06-25",
      className: "schedule-event-stock",
    },
  ];

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <button
          type="button"
          className="schedule-back-btn"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
        </button>

        <div>
          <p className="schedule-label">일정 관리</p>
          <h1>공사 일정</h1>
          <p className="schedule-desc">
            공사 현장 일정과 자재 입고 일정을 달력에서 확인하세요.
          </p>
        </div>
      </div>

      <div className="schedule-stat-grid">
        <StatCard
          icon={<FiCalendar />}
          title="전체 일정"
          value="18"
          unit="건"
        />
        <StatCard icon={<FiMapPin />} title="공사 일정" value="12" unit="건" />
        <StatCard icon={<FiTruck />} title="입고 일정" value="4" unit="건" />
        <StatCard
          icon={<FiCheckCircle />}
          title="완료 일정"
          value="2"
          unit="건"
        />
      </div>

      <section className="schedule-calendar-card">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2026-06-01"
          locale="ko"
          events={events}
          height="760px"
          headerToolbar={{
            left: "title",
            center: "",
            right: "today prev,next",
          }}
          buttonText={{
            today: "오늘",
          }}
        />
      </section>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  unit,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="schedule-stat-card">
      <div className="schedule-stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
    </div>
  );
}

export default SchedulePage;
