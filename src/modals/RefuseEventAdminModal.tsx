import { useContext, useState } from "react";
import { Event } from "../types/types";
import { UserContext } from "../context/context";
import useAccessToken from "../utilities/getAccesToken";

interface RefuseEventAdminModalProps {
    event: Event | null;
    events: Event[];
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const RefuseEventAdminModal = ({ onClose, event, events, setEvents }: RefuseEventAdminModalProps) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [refusalReason, setRefusalReason] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { getAccessToken } = useAccessToken();
    const { user } = useContext(UserContext);
    const server = import.meta.env.VITE_SERVER_URL;

    if (!user) {
        return null;
    }

    const submitHandler = async () => {
        if (!refusalReason.trim()) {
            setErrorMessage("Please provide a reason for refusal.");
            return;
        }
        if ( refusalReason.trim().length < 10 || refusalReason.trim().length > 100) {
            setErrorMessage("Reason for refusal must be between 10 and 100 characters.");
            return;
        }

        try {
            if (!event) return;
            const token = await getAccessToken();
            setLoading(true);
            setErrorMessage(null);
            setSuccessMessage(null);
            
            const response = await fetch(`${server}/api/events/deny/${event._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user._id,
                    refusalReason
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to refuse event');
            }

            setSuccessMessage('Event was refused successfully.');
            setEvents(events.filter((item) => item._id !== event._id));
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
            console.error('Error submitting refusal:', error);
        } finally {
            setLoading(false);
        }
    };
    if (!event) return;
    return (
        <div id="modal-form-overlay">
            <div id="modal-content-form">
                <button id="close-btn" onClick={() => onClose(false)}>X</button>
                <h2>Refuse: {event.title}</h2>

                {successMessage ? (
                    <div className="success-message">{successMessage}</div>
                ) : (
                    <form onSubmit={submitHandler}>
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
                            <button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RefuseEventAdminModal;