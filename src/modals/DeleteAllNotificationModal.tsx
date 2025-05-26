import { useContext, useState } from "react";
import { Notification } from "../types/types";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";
import useAccessToken from "../utilities/getAccesToken";

interface DeleteNotificationModalProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const DeleteAllNotificationModal = ({
  onClose,
  setNotifications,
}: DeleteNotificationModalProps) => {
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
    try {
      if (!user) return;
      setLoading(true);
      setErrorMessage("");
      const token = await getAccessToken();
      const response = await fetch(
        `${server}/api/users/notifications-all/${user._id}`,
        {
          method: "DELETE",
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
        const data = await response.json();
        throw new Error(data.message || "Failed to delete all notification");
      }
      setSuccessMessage("Notification was deleted successfully!");
      setNotifications([]);
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
      title="Delete notifications"
      content="Are you sure you want to delete all notifications?"
      onClose={onClose}
      onConfirm={clickHandler}
      loading={loading}
      confirmText="Confirm"
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};

export default DeleteAllNotificationModal;
