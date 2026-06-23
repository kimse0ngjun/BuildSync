import type { BaseModalProps } from "../../../types/Modal";

export default function BaseModal({
  isOpen,
  onClose,
  icon,
  title,
  subtitle,
  content,
  deleteIcon,
}: BaseModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="back-ground"
      onClick={onClose}
      style={{ width: "100%", height: "100%" }}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%" }}
      >
        <div
          className="title-area"
          style={{
            position: "relative",
            paddingRight: "40px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}
          >
            {icon && (
              <div
                className="icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "22px",
                  color: "#2563eb",
                }}
              >
                {icon}
              </div>
            )}
            <h2
              className="title"
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                color: "#10284a",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>
          </div>

          {subtitle && (
            <p
              className="subtitle"
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {subtitle}
            </p>
          )}

          <div
            className="delete-icon"
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              fontSize: "22px",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            {deleteIcon && (
              <div className="modal-delete-icon-wrapper">{deleteIcon}</div>
            )}
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e2e8f0",
            margin: "0 0 20px 0",
          }}
        />

        <div className="content">{content}</div>
      </div>
    </div>
  );
}
