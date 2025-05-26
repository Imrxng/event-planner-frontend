import { useContext, useEffect, useState } from "react";
import { Event } from "../types/types";
import { UserContext } from "../context/context";
import useAccessToken from "../utilities/getAccesToken";

interface RefuseEventAdminModalProps {
  event: Event | null;
  events: Event[];
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const RefuseEventAdminModal = ({
  onClose,
  event,
  events,
  setEvents,
}: RefuseEventAdminModalProps) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refusalReason, setRefusalReason] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!user || !event) return null;

  const submitHandler = async () => {
    const reason = refusalReason.trim();

    if (!reason) {
      setErrorMessage("Please provide a reason for refusal.");
      return;
    }
    if (reason.length < 10 || reason.length > 100) {
      setErrorMessage(
        "Reason for refusal must be between 10 and 100 characters.",
      );
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = await getAccessToken();

      const response = await fetch(`${server}/api/events/deny/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          refusalReason: reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to refuse event");
      }

      setSuccessMessage("Event was refused successfully.");
      setEvents(events.filter((item) => item._id !== event._id));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
      console.error("Error submitting refusal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="modal-form-overlay">
      <div id="modal-content-form">
        <button id="close-btn" onClick={() => onClose(false)}>
          X
        </button>
        <h2>Refuse: {event.title}</h2>

        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <>
            <div id="form-group">
              <label htmlFor="refusalReason">Reason for refusal</label>
              <input
                type="text"
                id="refusalReason"
                value={refusalReason}
                onChange={(e) => setRefusalReason(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <div id="form-actions">
              <button onClick={submitHandler} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RefuseEventAdminModal;
