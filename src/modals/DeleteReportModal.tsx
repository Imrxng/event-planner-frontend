import { useContext, useState } from "react";
import { Report } from "../types/types";
import { UserContext } from "../context/context";
import Modal from "./ConfirmModal";
import useAccessToken from "../utilities/getAccesToken";

interface ConfirmVoteModalProps {
  report: Report;
  reports: Report[];
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

const DeleteReportModal = ({
  onClose,
  report,
  reports,
  setReports,
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

  const submitHandler = async () => {
    if (!user) return;
    const token = await getAccessToken();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(
        `${server}/api/reports/${report.reportType}s/${report.targetId}/${user._id}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete report");
      }
      setSuccessMessage("Your report has been deleted successfully!");
      const updatedReports = reports.filter((item) => item._id !== report._id);
      setReports(updatedReports);
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
      title={`Report`}
      content={`Are you sure you want to delete the report?`}
      onClose={onClose}
      onConfirm={submitHandler}
      loading={loading}
      confirmText="Confirm"
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  );
};

export default DeleteReportModal;
