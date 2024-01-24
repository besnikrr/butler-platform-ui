import { Modal } from "@butlerhospitality/ui-sdk";

interface ModalContentProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ConfirmModal: React.FC<ModalContentProps> = ({ onClose, children }) => {
  return (
    <Modal visible onClose={() => onClose()} style={{ minWidth: 500 }}>
      {children}
    </Modal>
  );
};

export default ConfirmModal;
