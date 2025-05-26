import { useState, useContext, useEffect } from "react";
import "../styles/Modal.component.css";
import { UserContext } from "../context/context";
import { Event, Question } from "../types/types";
import useAccessToken from "../utilities/getAccesToken";

interface FormModalProps {
  form: Question[];
  event: Event;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

const FormModal = ({ form, event, onClose, setEvent }: FormModalProps) => {
  const [answers, setAnswers] = useState<string[]>(
    new Array(form.length).fill(""),
  );
  const [errors, setErrors] = useState<string[]>(
    new Array(form.length).fill(""),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();
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

  const handleChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);

    const updatedErrors = [...errors];
    updatedErrors[index] = value ? "" : "Dit veld is verplicht";
    setErrors(updatedErrors);
  };

  if (!user) return null;

  const handleSubmit = async () => {
    let valid = true;
    const updatedErrors = [...errors];

    answers.forEach((answer, index) => {
      if (!answer) {
        updatedErrors[index] = "Dit veld is verplicht";
        valid = false;
      }
    });

    setErrors(updatedErrors);
    if (!valid) return;

    setLoading(true);
    try {
      setErrorMessage("");
      const token = await getAccessToken();
      const response = await fetch(
        `${server}/api/events/attend-event/${event._id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: answers,
            userId: user._id,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSuccessMessage("Your registration was successful!");
      const updatedEvent: Event = {
        ...event,
        attendances: [...event.attendances, user._id.toString()],
      };
      setEvent(updatedEvent);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Er is een onbekende fout opgetreden");
      }
      console.error("Fout bij het verzenden van gegevens:", error);
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
        <h2>{event.form.length !== 0 ? "Participate" : event.title}</h2>

        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <>
            <div>
              {form.length !== 0 ? (
                form.map((question, index) => (
                  <div key={index} id="form-group">
                    <label>{question.question}</label>
                    {question.possibleAnswers.length > 0 ? (
                      <select
                        value={answers[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        required
                        id="form-modal-select"
                      >
                        <option value="" hidden disabled>
                          --select--
                        </option>
                        {question.possibleAnswers.map((answer, i) => (
                          <option key={i} value={answer}>
                            {answer}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={answers[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        required
                      />
                    )}
                    {errors[index] && (
                      <div className="error" id="error-form">
                        {errors[index]}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>Are you sure you want to participate in this event?</p>
              )}
              <div
                id="form-actions"
                style={{
                  justifyContent: errorMessage ? "space-between" : "flex-end",
                }}
              >
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormModal;
