import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import type { NotificationResponse } from "../../types/Notification";
import { notificationListApi } from "../../api/notificationApi";
import { MdDeleteOutline } from "react-icons/md";
import "../../styles/Notifications.css";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [currentTab, setCurrentTab] = useState<"ALL" | "UNREAD">("ALL");
  const companyId = Number(localStorage.getItem("companyId"));
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { isLogin } = useAuth();

  // 모든 알림 조회 핸들러
  const handleGetAllNotifications = (page: number = 0) => {
    setLoading(true);

    return notificationListApi
      .getAllNotification(companyId, page)
      .then((data) => {
        setNotifications(data.list || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
        setCurrentTab("ALL");

        return data;
      })
      .catch((err) => {
        console.error("전체 알림 조회 실패", err);
        throw err;
      })
      .finally(() => setLoading(false));
  };

  // 안 읽은 알림 조회 핸들러
  const handleGetUnreadNotifications = (page: number = 0) => {
    setLoading(true);

    return notificationListApi
      .getNotReadNotification(companyId, page)
      .then((data) => {
        setNotifications(data.list || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);
        setCurrentTab("UNREAD");

        return data;
      })
      .catch((err) => {
        console.error("안 읽은 알림 조회 실패", err);
        throw err;
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (newPage: number) => {
    if (currentTab === "ALL") {
      handleGetAllNotifications(newPage);
    } else {
      handleGetUnreadNotifications(newPage);
    }
  };

  // 단건 알림 읽음 처리 핸들러
  const handleReadNotification = (id: number) => {
    notificationListApi
      .setReadNotification(id)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notice) =>
            notice.noticeId === id ? { ...notice, isRead: 1 } : notice,
          ),
        );

        if (currentTab === "UNREAD") {
          setNotifications((prev) =>
            prev.filter((notice) => notice.noticeId !== id),
          );
        }
      })
      .catch((err) => console.error("단건 읽음 실패", err));
  };

  // 모든 알림 읽음 처리 핸들러
  const handleReadAllNotifications = () => {
    notificationListApi
      .setAllReadNotification(companyId)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notice) => ({ ...notice, isRead: 1 })),
        );
        if (currentTab === "UNREAD") {
          setNotifications([]);
        }
      })
      .catch((err) => console.error("전체 읽음 실패", err));
  };

  useEffect(() => {
    if (!isLogin) return;

    handleGetAllNotifications();
  }, [isLogin]);

  if (!isLogin) {
    return <LoginRequired />;
  }

  const deleteIcon = <MdDeleteOutline />;

  return (
    <div className="container">
      <h2 className="page-title">알림 페이지</h2>
      <hr className="line" />

      <div className="tab-area">
        <button
          className={`all-notification-list ${currentTab === "ALL" ? "active" : ""}`}
          onClick={() => handleGetAllNotifications(0)}
        >
          전체 알림
        </button>
        <button
          className={`not-read-list ${currentTab === "UNREAD" ? "active" : ""}`}
          onClick={() => handleGetUnreadNotifications(0)}
        >
          안 읽은 알림
        </button>
      </div>

      <div className="set-all-read-area">
        <button
          className="set-all-read-btn"
          onClick={handleReadAllNotifications}
        >
          모두 읽음 처리
        </button>
      </div>

      {loading ? (
        <p className="loading-message">알림을 로딩 중입니다...</p>
      ) : (
        <table className="list-table">
          <thead>
            <tr>
              <th className="th-type">구분</th>
              <th className="th-title">제목</th>
              <th className="th-content">내용</th>
              <th className="th-createdAt">받은 날짜</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr className="if-no-data">
                <td className="if-no-data-message" colSpan={5}>
                  조건에 맞는 알림이 존재하지 않습니다.
                </td>
              </tr>
            ) : (
              notifications.map((notice) => (
                <tr key={notice.noticeId}>
                  <td className="type-data">{notice.type}</td>

                  <td
                    className="title-data"
                    onClick={() => handleReadNotification(notice.noticeId)}
                  >
                    {notice.title}
                    {notice.isRead === 0 && <span> ●</span>}{" "}
                  </td>

                  <td className="content-data">{notice.content}</td>

                  <td className="createdAt-data">{notice.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="pagination-area">
        <button
          className="prev-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className="current-page-btn"
            key={index}
            onClick={() => handlePageChange(index)}
            disabled={currentPage === index}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="next-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
        >
          다음
        </button>
      </div>
    </div>
  );
}
