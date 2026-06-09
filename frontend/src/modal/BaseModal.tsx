import type { BaseModalProps } from "../types/Modal";

export default function BaseModal({
  isOpen,
  onClose,
  icon,
  title,
  subtitle,
  content,
}: BaseModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="back-ground" onClick={onClose}>
      <div className="modal-card">
        <div className="title-area">
          <div className="icon">{icon}</div>
          <h2 className="title">{title}</h2>
          <p className="subtitle">{subtitle}</p>
        </div>
        <hr />

        <div className="content">{content}</div>
      </div>
    </div>
  );
}
