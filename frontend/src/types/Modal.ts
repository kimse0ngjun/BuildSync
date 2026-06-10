export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  deleteIcon: React.ReactNode;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}
