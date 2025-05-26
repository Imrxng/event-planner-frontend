import { useContext, useEffect, useState } from "react";
import { Poll } from "../types/types";
import { UserContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../utilities/getAccesToken";

interface DeletePollModalProps {
  poll: Poll | null;
  polls?: Poll[];
  setPolls?: React.Dispatch<React.SetStateAction<Poll[]>>;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  navigateLink: string;
}

const DeletePollModal = ({
  onClose,
  poll,
  navigateLink,
  polls,
  setPolls,
}: DeletePollModalProps) => {
  const [inputQuestion, setInputTitle] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!user) {
    return null;
  }

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!poll) return;

    if (inputQuestion.trim() !== poll.question) {
      setErrorMessage("The question does not match the poll question.");
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessToken();
      const response = await fetch(`${server}/api/polls/${poll._id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      if (polls && setPolls) {
        const updatedPolls = polls.filter((p) => p._id !== poll._id);
        setPolls(updatedPolls);
      }

      setSuccessMessage("Poll successfully deleted!");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    onClose(false);
    if (successMessage) {
      navigate(navigateLink);
    }
  };

  return (
    <div id="modal-form-overlay">
      <div id="modal-content-form">
        <button id="close-btn" onClick={clickHandler}>
          X
        </button>
        <h2>Delete Poll</h2>

        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <>
            <div id="form-group">
              <label>
                Type{" "}
                <span style={{ fontWeight: "bolder", color: "black" }}>
                  '{poll?.question}'
                </span>{" "}
                to confirm deletion.
              </label>
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputTitle(e.target.value)}
                required
                id="modalTitle-input"
              />
            </div>
            <div
              id="form-actions"
              style={{
                justifyContent: errorMessage ? "space-between" : "flex-end",
              }}
            >
              {errorMessage && <div className="error">{errorMessage}</div>}
              <button onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeletePollModal;
