import { useContext, useState, useEffect } from "react";
import { MongoDbUser } from "../types/types";
import { UserContext } from "../context/context";
import useAccessToken from "../utilities/getAccesToken";

interface EditUserAdminModalProps {
  userEdit: MongoDbUser | null;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditUserAdminModal = ({ onClose, userEdit }: EditUserAdminModalProps) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>(
    userEdit?.location || "All Locations",
  );
  const [role, setRole] = useState<string>(userEdit?.role || "user");
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (userEdit) {
      setLocation(userEdit.location || "all");
      setRole(userEdit.role || "user");
    }
  }, [userEdit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!user || !userEdit) {
    return null;
  }

  const submitHandler = async () => {
    try {
      if (user._id === userEdit._id) {
        setErrorMessage("You cannot update your own user data.");
        return;
      }
      const token = await getAccessToken();
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await fetch(`${server}/api/users/${userEdit._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          role,
          userId: user._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      setSuccessMessage("User updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="modal-form-overlay">
      <div id="modal-content-form">
        <button id="close-btn" onClick={() => onClose(false)}>
          X
        </button>
        <h2>Edit User: {userEdit.name}</h2>

        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <>
            <div id="form-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="Brightest East">Brightest East</option>
                <option value="Brightest North">Brightest North</option>
                <option value="Brightest West">Brightest West</option>
              </select>
            </div>

            <div id="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
            <div id="form-actions">
              <button onClick={submitHandler} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditUserAdminModal;
