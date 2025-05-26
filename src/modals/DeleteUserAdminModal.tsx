import { useContext, useState } from "react";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";
import useAccessToken from "../utilities/getAccesToken";

interface DeleteUserAdminModalProps {
  userIdToDelete: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteUserAdminModal = ({
  onClose,
  userIdToDelete,
}: DeleteUserAdminModalProps) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  if (!user) {
    return null;
  }

  const submitHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (!userIdToDelete) {
      setErrorMessage("No user selected for deletion.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = await getAccessToken();
      if (!userIdToDelete) return;
      if (user._id === userIdToDelete) {
        setErrorMessage("You cannot delete your own account.");
        return;
      }

      const response = await fetch(
        `${server}/api/users/delete/${userIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      setSuccessMessage("User deleted successfully!");
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
      title={`Delete User`}
      content={`Are you sure you want to delete this user? This action cannot be undone.`}
      onClose={onClose}
      onConfirm={submitHandler}
      loading={loading}
      confirmText="Confirm"
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};

export default DeleteUserAdminModal;
