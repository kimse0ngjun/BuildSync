import { useEffect, useState, useCallback } from "react";
import { getSchedules } from "../../api/schedule";
import type { ScheduleResponse } from "../../types/schedule";
import "../../styles/ScheduleList.css";

function ScheduleList() {
  const [list, setList] = useState<ScheduleResponse[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await getSchedules(1);
      setList(res.data.list);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    load();

    const handleFocus = () => {
      load();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [load]);

  return (
    <div className="schedule-list-page">
      <div className="schedule-list-header">
        <h1>공사 일정</h1>
        <p>등록된 공사 일정을 확인할 수 있습니다.</p>
      </div>

      {list.map((item) => (
        <div key={item.scheduleId} className="schedule-list-card">
          <div className="schedule-list-title">{item.title}</div>

          <div className="schedule-list-site">현장 : {item.siteName}</div>

          <div className="schedule-list-date">
            {item.startDate} ~ {item.endDate}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScheduleList;
