import { useContext, useState } from "react";
import { Event } from "../types/types";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";
import useAccessToken from "../utilities/getAccesToken";

interface RejectEventModalProps {
  event: Event;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

const RejectEventModal = ({
  onClose,
  event,
  setEvent,
}: RejectEventModalProps) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  if (!user) {
    return;
  }
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    try {
      setErrorMessage("");
      const token = await getAccessToken();
      const response = await fetch(
        `${server}/api/events/decline-event/${event._id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: event._id,
            userId: user._id,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      setSuccessMessage("Event successfully declined");
      const updatedEvent: Event = {
        ...event,
        declinedUsers: [...event.declinedUsers, user._id.toString()],
      };
      setEvent(updatedEvent);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      content="Are you sure you want to decline this event?"
      title="Decline event"
      onClose={onClose}
      onConfirm={clickHandler}
      loading={loading}
      confirmText="Confirm"
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};

export default RejectEventModal;
