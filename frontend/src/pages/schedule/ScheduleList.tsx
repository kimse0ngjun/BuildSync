import { useEffect, useState } from "react";
import { getSchedules } from "../../api/schedule";
import type { ScheduleResponse } from "../../types/schedule";

function ScheduleList() {
  const [list, setList] = useState<ScheduleResponse[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getSchedules(1);
      setList(res.data.list); 
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>공사 일정</h1>

      {list.map((item) => (
        <div key={item.scheduleId}>
          <h3>{item.title}</h3>
          <p>현장 : {item.siteName}</p>
          <p>{item.startDate} ~ {item.endDate}</p>
        </div>
      ))}
    </div>
  );
}

export default ScheduleList;