import { useContext, useEffect, useState } from "react";
import { MongoDbUser } from "../../types/types";
import "../../styles/userdatacompleter.component.css";
import { useAccount, useMsal } from "@azure/msal-react";
import useAccessToken from "../../utilities/getAccesToken";
import { UserContext } from "../../context/context";
import { uploadBlobAsUserImage } from "../../utilities/imageUtilities";

const UserDataCompleter = () => {
  const [currentUser, setCurrentUser] = useState<{ user: null | MongoDbUser }>({
    user: null,
  });
  const [location, setLocation] = useState<string>("");
  const [errors, setErrors] = useState<{ location?: string }>({});
  const [fetchError, setFetchError] = useState<boolean>(true);

  const server = import.meta.env.VITE_SERVER_URL;
  const { getAccessToken } = useAccessToken();
  const { accounts } = useMsal();
  const { setUser, user } = useContext(UserContext);
  const account = useAccount(accounts[0] || {});
  const oid: string = account?.idTokenClaims?.oid || "";

  const fetchUser = async () => {
    if (!account || user) {
      return;
    }

    try {
      const token: string = await getAccessToken();
      if (!token) {
        return;
      }
      const response = await fetch(`${server}/api/users/${oid}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setCurrentUser(data);
      setUser(data.user);
      setFetchError(false);
    } catch (error) {
      console.error(error);
      setFetchError(true);
    }
  };
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = () => {
    const newErrors: { location?: string } = {};
    if (!location) {
      newErrors.location = "Please fill in a location";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async () => {
    if (!validate()) return;
    const token = await getAccessToken();
    try {
      const photoResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const blob = await photoResponse.blob();
      let pictureUrl = "";
      if (photoResponse.status === 404 || blob.size === 0) {
        pictureUrl = "not-found";
      } else {
        pictureUrl = await uploadBlobAsUserImage(blob, oid, token);
      }
      await fetch(`${server}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: oid,
          location,
          picture: pictureUrl,
          name: account?.idTokenClaims?.name,
        }),
      });

      fetchUser();
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };

  if (currentUser.user === null && !fetchError) {
    return (
      <div className="overlay">
        <div className="modal">
          <h2>Welcome, {account?.idTokenClaims?.name}!</h2>
          <p>Please complete your profile by selecting your location:</p>
          <div>
            <label htmlFor="location">Region:</label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={validate}
              className="location-select"
            >
              <option value="" selected disabled hidden>
                -Select location-
              </option>
              <option value="Brightest North">Brightest North (Kontich)</option>
              <option value="Brightest West">Brightest West (Gent)</option>
              <option value="Brightest East">Brightest East (Genk)</option>
              <option value="all">All (office)</option>
            </select>
            {errors.location && <div className="error">{errors.location}</div>}
          </div>
          <div>
            <button
              type="button"
              onClick={handleClick}
              className="userdatacompleter-submit-button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UserDataCompleter;
