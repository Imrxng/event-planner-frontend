import { useContext, useState } from "react";
import { Poll } from "../types/types";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";
import useAccessToken from "../utilities/getAccesToken";

interface ConfirmVoteModalProps {
  poll: Poll;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: string | null;
  setPoll: React.Dispatch<React.SetStateAction<Poll | undefined>>;
}

const ConfirmVoteModal = ({
  onClose,
  poll,
  setPoll,
  selectedOption,
}: ConfirmVoteModalProps) => {
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
    if (!selectedOption) {
      setErrorMessage("Please select an option before voting.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const token = await getAccessToken();
      if (!poll || !user) return;

      const response = await fetch(`${server}/api/polls/vote/${poll._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedOption,
          voterId: user._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit vote");
      }

      const updatedPoll = await response.json();
      setPoll(updatedPoll.poll);
      setSuccessMessage("Your vote has been submitted successfully!");
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
      title={`Vote`}
      content={`Are you sure you want to vote on ${selectedOption}?`}
      onClose={onClose}
      onConfirm={submitHandler}
      loading={loading}
      confirmText="Confirm"
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};

export default ConfirmVoteModal;
