import { useContext, useState } from "react";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";
import useAccessToken from "../utilities/getAccesToken";
import { Event } from "../types/types";

interface ApproveEventModalProps {
  event: Event | null;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const ApproveEventModal = ({
  onClose,
  event,
  setEvents,
}: ApproveEventModalProps) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  if (!user) {
    return;
  }
  const submitHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = await getAccessToken();
      if (!event || !user) return;

      const response = await fetch(
        `${server}/api/events/approve/${event._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve event");
      }

      event.validated = true;
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e._id === event._id ? { ...e, validated: true } : e,
        ),
      );
      setSuccessMessage("Event has been approved successfully");
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
      title={`Approve event`}
      content={`Are you sure you want to approve event titled: ${(event && event.title) || "not found"}`}
      onClose={onClose}
      onConfirm={submitHandler}
      loading={loading}
      confirmText="Confirm"
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};

export default ApproveEventModal;
