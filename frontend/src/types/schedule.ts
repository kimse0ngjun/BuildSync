export interface Schedule {
  scheduleId: number;
  companyId: number;
  companyName: string;

  title: string;
  content: string;

  startDate: string;
  endDate: string;

  status: string;
}


export interface ScheduleRequest {
  companyId: number;

  title: string;
  content: string;

  startDate: string;
  endDate: string;
}