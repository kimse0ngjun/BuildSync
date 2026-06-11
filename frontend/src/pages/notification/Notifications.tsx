import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import type { Notification } from "../../types/NotificationDTO";
import { useNavigate } from "react-router-dom";

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      // 공급업체가 받는
      noticeId: 1,
      type: "NEW_ORDER",
      title: "신규 발주서 접수 대기",
      content:
        "[용산 주상복합 현장]에서 레미콘 자재 발주서(#3025)를 등록했습니다. 접수 상태를 확인하세요.",
      relatedId: 3025,
      isRead: false,
      createdAt: "방금 전",
    },
    {
      // 건설업체가 받는
      noticeId: 2,
      type: "ORDER_ACCEPTED",
      title: "발주 승인 완료",
      content:
        "[OO상사]에서 요청하신 철근/철강자재 발주서(#3021)를 정상 승인(접수)했습니다.",
      relatedId: 3021,
      isRead: false,
      createdAt: "10분 전",
    },
    {
      // 건설업체가 받는
      noticeId: 3,
      type: "BUDGET_WARNING",
      title: "⚠️ 현장 지출 예산 초과 경고",
      content: "당월 자재 누적 지출액이 지난달보다 50%를 초과했습니다.",
      relatedId: 0,
      isRead: true,
      createdAt: "2시간 전",
    },
    {
      // 건설업체가 받는
      noticeId: 4,
      type: "ORDER_REJECTED",
      title: "발주 반려/거절 안내",
      content:
        "[XX네트워크]에서 재고 부족 사유로 발주서(#3018)를 반려 처리했습니다.",
      relatedId: 3018,
      isRead: true,
      createdAt: "2026-06-09",
    },
  ]);

  // 알림 타입별 아이콘 설정
  const getNoticeIcon = (type: string) => {
    switch (type) {
      case "NEW_ORDER":
        return <FaRegBell style={{ color: "#413ea0" }} />;
      case "ORDER_ACCEPTED":
        return <FaCheckCircle style={{ color: "#00C49F" }} />;
      case "ORDER_REJECTED":
        return <FaTimesCircle style={{ color: "#f44336" }} />;
      case "BUDGET_WARNING":
        return <FaExclamationTriangle style={{ color: "#FFBB28" }} />;
      default:
        return <FaRegBell style={{ color: "#888" }} />;
    }
  };

  const nav = useNavigate();

  return (
    <div className="notification-center-container">
      <div className="notice-header">
        <div className="header">
          <h2 className="title">알림 센터</h2>
          <p className="explain">
            현장 및 발주서 상태 변경 알림을 실시간으로 확인하세요.
          </p>
        </div>

        <button className="btn-all-read">
          <IoCheckmarkDoneSharp className="all-read-icon" />
          모두 읽음
        </button>
      </div>

      <div className="notice-list-wrapper">
        {notifications.length > 0 ? (
          notifications.map((notice) => (
            <div
              key={notice.noticeId}
              className={`notice-item-card ${notice.isRead ? "read" : "unread"}`}
            >
              <div className="notice-icon-area">
                {getNoticeIcon(notice.type)}
              </div>

              <div className="notice-content-area">
                <div className="notice-header">
                  <h4 className="notice-title">{notice.title}</h4>
                  {!notice.isRead && <span>N</span>}
                </div>
                <p className="notice-content">{notice.content}</p>
              </div>

              <div className="notice-time-area">{notice.createdAt}</div>
            </div>
          ))
        ) : (
          <div className="no-notification">새로운 알림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};
