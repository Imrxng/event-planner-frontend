import { useContext, useState } from "react";
import { UserContext } from "../context/context";
import useAccessToken from "../utilities/getAccesToken";

interface ReportModalProps {
    targetType: 'event' | 'poll'; 
    targetId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportModal = ({ onClose, targetType, targetId }: ReportModalProps) => {
    const [report, setReport] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { getAccessToken } = useAccessToken();
    const { user } = useContext(UserContext);
    const server = import.meta.env.VITE_SERVER_URL;

    if (!user) return null;

    const MIN_LENGTH = 10;
    const MAX_LENGTH = 500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        if (report.trim().length === 0) {
            setErrorMessage('Report cannot be empty.');
            setLoading(false);
            return;
        }

        if (report.length < MIN_LENGTH) {
            setErrorMessage(`Report must be at least ${MIN_LENGTH} characters.`);
            setLoading(false);
            return;
        }

        if (report.length > MAX_LENGTH) {
            setErrorMessage(`Report cannot exceed ${MAX_LENGTH} characters.`);
            setLoading(false);
            return;
        }
        try {
            const token = await getAccessToken();
            const response = await fetch(`${server}/api/reports/${targetType}s/${targetId}`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user._id,
                    reportData: report,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            setSuccessMessage('Report successfully submitted!');
            setReport('');
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="modal-form-overlay">
            <div id="modal-content-form">
                <button id="close-btn" onClick={() => onClose(false)}>X</button>
                <h2>Submit Report</h2>

                {successMessage ? (
                    <div className="success-message">{successMessage}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div id="form-group">
                            <label>Report</label>
                            <textarea
                                value={report}
                                onChange={(e) => setReport(e.target.value)}
                                required
                                id="modalReport-textarea"
                                maxLength={MAX_LENGTH}
                                rows={6}
                            />
                            <div className="character-count">
                                {report.length}/{MAX_LENGTH} characters
                            </div>
                        </div>
                        <div id="form-actions" style={{ justifyContent: errorMessage ? "space-between" : "flex-end" }}>
                            {errorMessage && <div className="error">{errorMessage}</div>}
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

export default ReportModal;
