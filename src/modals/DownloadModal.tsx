import { useEffect } from "react";

interface DeleteEventModalProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteEventModal = ({ onClose }: DeleteEventModalProps) => {
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
        <h1>No Attendance Records</h1>
        <p>
          You cannot download the attendance list because no one has signed up
          yet.
        </p>
      </div>
    </div>
  );
};

export default DeleteEventModal;
