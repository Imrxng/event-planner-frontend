import { useContext, useState } from "react";
import { Event } from "../types/types";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";
import useAccessToken from "../utilities/getAccesToken";

interface CancelAttendanceModalProps {
  event: Event;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

const CancelAttendanceModal = ({
  onClose,
  event,
  setEvent,
}: CancelAttendanceModalProps) => {
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
        `${server}/api/events/${event._id}/attendances/${user._id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      setSuccessMessage("Participation has been withdrawn");
      const filteredEvent: Event = {
        ...event,
        attendances: event.attendances.filter(
          (attendance) => attendance !== user._id,
        ),
      };
      setEvent(filteredEvent);
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
      title="Cancel participation"
      content="Are you sure you want to cancel your participation?"
      onClose={onClose}
      onConfirm={clickHandler}
      loading={loading}
      confirmText="Confirm"
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};

export default CancelAttendanceModal;
