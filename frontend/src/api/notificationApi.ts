import axios from "axios";
import {
  type NotificationResponse,
  type PageResponse,
} from "../types/NotificationDTO";

const api = axios.create({
  baseURL: "http://localhost:8080/api/notification",
  headers: {
    "Content-Type": "application/json",
  },
});

export const notificationListApi = {
  // 모든 알림 조회
  getAllNotification: (companyId: number, page: number = 0) => {
    return api
      .get<
        PageResponse<NotificationResponse>
      >(`list?companyId=${companyId}&page=${page}`)
      .then((res) => res.data);
  },

  // 안 읽은 알림 조회
  getNotReadNotification: (companyId: number, page: number = 0) => {
    return api
      .get<
        PageResponse<NotificationResponse>
      >(`/not-read-list?companyId=${companyId}&page=${page}`)
      .then((res) => res.data);
  },

  // 단건 읽음 처리
  setReadNotification: (id: number) => {
    return api.patch<string>(`/read/${id}`).then((res) => res.data);
  },

  // 전체 읽음 처리
  setAllReadNotification: (companyId: number) => {
    return api
      .patch<string>(`/read-all?companyId=${companyId}`)
      .then((res) => res.data);
  },
};
