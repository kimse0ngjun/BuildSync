export type EventType = "SITES" | "MATERIAL";
export type MaterialType = "IN" | "OUT";

export interface CalendarEventResponse {
  eventId: number;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  eventType: EventType;
  materialType?: MaterialType;
  siteId?: number;
  siteName?: string;
  supplierId?: number;
  supplierName?: string;
}

export interface ScheduleResponse {
  scheduleId: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  siteId: number;
  siteName: string;
}

export interface ScheduleListResponse {
  list: ScheduleResponse[];
  totalElements: number;
  totalPages: number;
  pageNum: number;
  pageSize: number;
}

export interface ScheduleRequest {
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  siteId: number;
}
