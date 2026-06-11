export interface Notification {
  noticeId: number;
  type: "NEW_ORDER" | "ORDER_ACCEPTED" | "ORDER_REJECTED" | "BUDGET_WARNING";
  title: string;
  content: string;
  relatedId: number;
  isRead: boolean;
  createdAt: string;
}
