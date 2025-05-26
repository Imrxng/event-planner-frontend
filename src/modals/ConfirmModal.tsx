import { useEffect } from "react";

interface ModalProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
  confirmText: string;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  content: string;
}

const Modal = ({
  title,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  loading,
  successMessage,
  errorMessage,
  content,
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <div id="modal-form-overlay">
      <div id="modal-content-form">
        <button id="close-btn" onClick={() => onClose(false)}>
          X
        </button>
        <h2>{title}</h2>
        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <>
            <p>{content}</p>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button
              id="modal-cancel-button"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Submitting..." : confirmText}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
