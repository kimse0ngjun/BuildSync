import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiCheckCircle,
  FiX,
  FiArrowLeft as FiBack,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { getCalendarEvents, getSchedule } from "../../api/schedule";
import type {
  CalendarEventResponse,
  ScheduleResponse,
} from "../../types/schedule";
import "../../styles/SchedulePage.css";
import "../../styles/ScheduleList.css";

// 상태 뱃지 설정
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "입고 예정", className: "badge-pending" },
  ACCEPTED: { label: "진행 중", className: "badge-in-progress" },
  END: { label: "입고 완료", className: "badge-done" },
  CANCELED: { label: "취소", className: "badge-canceled" },

  READY: {
    label: "공사 예정",
    className: "badge-pending",
  },
  IN_PROGRESS: {
    label: "진행 중",
    className: "badge-in-progress",
  },
  COMPLETED: {
    label: "공사 완료",
    className: "badge-done",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    className: "badge-done",
  };
  return <span className={`schedule-badge ${cfg.className}`}>{cfg.label}</span>;
}

function SchedulePage() {
  const navigate = useNavigate();

  const companyId = Number(localStorage.getItem("companyId"));

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const [modalDate, setModalDate] = useState<string | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEventResponse[]>([]);
  const [detail, setDetail] = useState<ScheduleResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadCalendar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCalendarEvents(companyId, year, month);
      setCalendarEvents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [companyId, year, month]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  const fcEvents = calendarEvents.map((ev) => ({
    id: String(ev.eventId),
    title: ev.title,
    start: ev.startDate,
    end: ev.endDate,
    className:
      ev.eventType === "SITES" ? "schedule-event-site" : "schedule-event-stock",
    extendedProps: { eventType: ev.eventType, status: ev.status },
  }));

  function handleDateClick(arg: DateClickArg) {
    const clicked = arg.dateStr;
    const eventsOnDay = calendarEvents.filter((ev) => {
      return clicked >= ev.startDate && clicked <= ev.endDate;
    });
    setModalDate(clicked);
    setDayEvents(eventsOnDay);
    setDetail(null);
  }

  function handleEventClick(arg: EventClickArg) {
    const eventId = Number(arg.event.id);

    const ev = calendarEvents.find((e) => e.eventId === eventId);

    if (!ev) return;
    const dateStr = ev.startDate;
    const eventsOnDay = calendarEvents.filter((e) => {
      const start = e.startDate;
      const end = e.endDate ?? e.startDate;

      return dateStr >= start && dateStr <= end;
    });

    setModalDate(dateStr);
    setDayEvents(eventsOnDay);
    setDetail(null);

    if (ev.eventType === "SITES") {
      openDetail(ev.eventId);
    }
  }

  async function openDetail(scheduleId: number) {
    setDetailLoading(true);
    try {
      const res = await getSchedule(companyId, scheduleId);
      setDetail(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeModal() {
    setModalDate(null);
    setDayEvents([]);
    setDetail(null);
  }

  function handleDatesSet(dateInfo: any) {
    const current = dateInfo.view.currentStart;

    const newYear = current.getFullYear();
    const newMonth = current.getMonth() + 1;

    if (newYear !== year || newMonth !== month) {
      setYear(newYear);
      setMonth(newMonth);
    }
  }

  const totalCount = calendarEvents.length;
  const siteCount = calendarEvents.filter(
    (e) => e.eventType === "SITES",
  ).length;
  const materialCount = calendarEvents.filter(
    (e) => e.eventType === "MATERIAL",
  ).length;
  const doneCount = fcEvents.filter((event) => {
    return (
      (event.extendedProps.eventType === "SITES" &&
        event.extendedProps.status === "COMPLETED") ||
      (event.extendedProps.eventType === "MATERIAL" &&
        event.extendedProps.status === "END")
    );
  }).length;

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
        <StatCard icon={<FiCalendar />} title="전체 일정" value={totalCount} />
        <StatCard icon={<FiMapPin />} title="공사 일정" value={siteCount} />
        <StatCard icon={<FiTruck />} title="입고 일정" value={materialCount} />
        <StatCard
          icon={<FiCheckCircle />}
          title="완료 일정"
          value={doneCount}
        />
      </div>

      <section className="schedule-calendar-card">
        {loading && <div className="schedule-loading">불러오는 중…</div>}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          events={fcEvents}
          height="760px"
          headerToolbar={{
            left: "title",
            center: "",
            right: "today prev,next",
          }}
          buttonText={{ today: "오늘" }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
        />
      </section>

      {modalDate && (
        <ScheduleModal
          date={modalDate}
          events={dayEvents}
          detail={detail}
          detailLoading={detailLoading}
          onEventClick={(ev) => {
            if (ev.eventType === "SITES") openDetail(ev.eventId);
          }}
          onBack={() => setDetail(null)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="schedule-stat-card">
      <div className="schedule-stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>건</span>
      </div>
    </div>
  );
}

interface ScheduleModalProps {
  date: string;
  events: CalendarEventResponse[];
  detail: ScheduleResponse | null;
  detailLoading: boolean;
  onEventClick: (ev: CalendarEventResponse) => void;
  onBack: () => void;
  onClose: () => void;
}

function ScheduleModal({
  date,
  events,
  detail,
  detailLoading,
  onEventClick,
  onBack,
  onClose,
}: ScheduleModalProps) {
  const navigate = useNavigate();
  const dt = new Date(date);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const dateLabel = `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일 (${weekDays[dt.getDay()]})`;

  const siteEvents = events.filter((e) => e.eventType === "SITES");
  const materialEvents = events.filter((e) => e.eventType === "MATERIAL");
  const isDetail = !!detail || detailLoading;

  return (
    <div
      className="schedule-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="schedule-modal">
        <div className="schedule-modal-header">
          <div>
            <p className="schedule-modal-date">{dateLabel}</p>
            <h2>{isDetail ? "일정 상세" : "일정 목록"}</h2>
          </div>
          <button
            className="schedule-modal-close"
            onClick={isDetail ? onBack : onClose}
            aria-label={isDetail ? "목록으로" : "닫기"}
          >
            {isDetail ? <FiBack /> : <FiX />}
          </button>
        </div>

        {!isDetail && (
          <div className="schedule-modal-badges">
            {siteEvents.length > 0 && (
              <span className="schedule-type-badge badge-type-site">
                공사 일정 {siteEvents.length}건
              </span>
            )}
            {materialEvents.length > 0 && (
              <span className="schedule-type-badge badge-type-material">
                입고 일정 {materialEvents.length}건
              </span>
            )}
            {events.length === 0 && (
              <p className="schedule-modal-empty">
                이날 등록된 일정이 없습니다.
              </p>
            )}
          </div>
        )}

        <div className="schedule-modal-body">
          {!isDetail && (
            <>
              {siteEvents.length > 0 && (
                <div className="schedule-modal-section">
                  <p className="schedule-modal-section-title">
                    <FiMapPin size={13} /> 공사 일정
                  </p>
                  {siteEvents.map((ev) => (
                    <EventRow
                      key={ev.eventId}
                      event={ev}
                      clickable
                      onClick={() => onEventClick(ev)}
                    />
                  ))}
                </div>
              )}
              {materialEvents.length > 0 && (
                <div className="schedule-modal-section">
                  <p className="schedule-modal-section-title">
                    <FiTruck size={13} /> 자재 입고
                  </p>

                  {materialEvents.map((ev) => (
                    <EventRow key={ev.eventId} event={ev} clickable={false} />
                  ))}
                </div>
              )}
            </>
          )}

          {detailLoading && (
            <p className="schedule-modal-loading">불러오는 중…</p>
          )}

          {detail && !detailLoading && (
            <div className="schedule-detail">
              <p className="schedule-detail-title">{detail.title}</p>
              <div className="schedule-detail-rows">
                <DetailRow icon={<FiClock />} label="기간">
                  {detail.startDate} ~ {detail.endDate}
                </DetailRow>
                <DetailRow icon={<FiMapPin />} label="현장">
                  {detail.siteName}
                </DetailRow>
                {detail.content && (
                  <DetailRow icon={<FiFileText />} label="내용">
                    {detail.content}
                  </DetailRow>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="schedule-modal-footer">
          <button
            className="schedule-modal-btn-secondary"
            onClick={isDetail ? onBack : onClose}
          >
            {isDetail ? "목록으로" : "닫기"}
          </button>
          {detail && (
            <button
              className="schedule-modal-btn-primary"
              onClick={() => navigate(`/site/edit/${detail.siteId}`)}
            >
              일정 수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EventRow({
  event,
  clickable,
  onClick,
}: {
  event: CalendarEventResponse;
  clickable: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`schedule-event-row ${clickable ? "clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
      style={{
        borderLeft: `3px solid ${event.eventType === "SITES" ? "#185FA5" : "#3B6D11"}`,
      }}
    >
      <div className="schedule-event-row-top">
        <div>
          <p className="schedule-event-row-title">{event.title}</p>
          <p className="schedule-event-row-sub">
            {event.eventType === "SITES"
              ? `현장 : ${event.siteName}`
              : `공급 업체 : ${event.supplierName}`}
          </p>
        </div>
        <StatusBadge status={event.status} />
      </div>
      <p className="schedule-event-row-date">
        {event.startDate} ~ {event.endDate}
        {clickable && (
          <span className="schedule-event-row-link">상세 보기 →</span>
        )}
      </p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="schedule-detail-row">
      <span className="schedule-detail-icon">{icon}</span>
      <span className="schedule-detail-label">{label}</span>
      <span className="schedule-detail-value">{children}</span>
    </div>
  );
}

export default SchedulePage;
