import axios from "axios";
import type {
  CalendarEventResponse,
  ScheduleResponse,
  ScheduleListResponse,
  ScheduleRequest,
} from "../types/schedule";

const BASE = `${import.meta.env.VITE_API_URL}/schedule`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getCalendarEvents = (
  companyId: number,
  year: number,
  month: number,
  type = "ALL",
  status = "ALL",
) => {
  return axios.get<CalendarEventResponse[]>(`${BASE}/calendar`, {
    params: {
      companyId,
      year,
      month,
      type,
      status,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getSchedules = (companyId: number, page = 0, size = 10) =>
  axios.get<ScheduleListResponse>(`${BASE}/list`, {
    params: {
      companyId,
      page,
      size,
      sort: "startDate,desc",
    },
    headers: getAuthHeader(),
  });

export const getSchedule = (companyId: number, scheduleId: number) =>
  axios.get<ScheduleResponse>(`${BASE}/${scheduleId}`, {
    params: {
      companyId,
    },
    headers: getAuthHeader(),
  });

export const createSchedule = (companyId: number, data: ScheduleRequest) => {
  return axios.post<ScheduleResponse>(`${BASE}`, data, {
    params: {
      companyId,
    },
    headers: getAuthHeader(),
  });
};
