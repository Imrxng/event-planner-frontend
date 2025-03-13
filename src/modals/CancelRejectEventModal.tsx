import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import { Event } from "../types/types";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";

interface RejectEventModalProps {
    event: Event;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

const CancelRejectEventModal = ({ onClose, event, setEvent }: RejectEventModalProps) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { getAccessTokenSilently } = useAuth0();
    const mongoDbUser = useContext(UserContext);
    const server = import.meta.env.VITE_SERVER_URL;

    if (!mongoDbUser) {
        return;
    }
    const clickHandler: React.MouseEventHandler<HTMLButtonElement> = async () => {
        setLoading(true);
        try {
            setErrorMessage('');
            const token = await getAccessTokenSilently();
            const response = await fetch(`${server}/api/events/${event._id}/attendances-declined/${mongoDbUser._id}`, {
                method: 'DELETE',
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }
            setSuccessMessage('Rejection has been withdrawn');
            const filteredEvent: Event = {
                ...event,
                declinedUsers: event.declinedUsers.filter((declinedUser) => declinedUser !== mongoDbUser._id)
            }
            setEvent(filteredEvent);
            setErrorMessage(null);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal title='Reject event' onClose={onClose} onConfirm={clickHandler} loading={loading} confirmText='Confirm' successMessage={successMessage} errorMessage={errorMessage} />
    )
}

export default CancelRejectEventModal;