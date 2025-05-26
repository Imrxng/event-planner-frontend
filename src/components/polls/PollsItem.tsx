import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { MongoDbUser, Poll } from "../../types/types";
import profile from "../../assets/images/profile.webp";
import { useEffect, useState } from "react";
import useAccessToken from "../../utilities/getAccesToken";
import FullscreenLoader from "../spinner/FullscreenLoader";
import { fetchImageWithToken } from "../../utilities/imageUtilities";

interface PollsItemProps {
  poll: Poll;
}

const PollsItem = ({ poll }: PollsItemProps) => {
  const navigate = useNavigate();
  const [createdBy, setCreatedBy] = useState<MongoDbUser>();
  const [loading, setLoading] = useState<boolean>(false);
  const { getAccessToken } = useAccessToken();
  const server = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchCreatedBy = async () => {
      try {
        setLoading(true);
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/users/${poll.createdBy}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch poll data");
        }

        const data = await response.json();
        data.user.picture = await fetchImageWithToken(data.user._id, token);
        setCreatedBy(data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll.createdBy, server]);

  return (
    <div className="polls-item">
      {loading && <FullscreenLoader content="Loading more data..." />}
      <div className="polls-item__header">
        <h1 className="polls-item__title">{poll.question}</h1>
        <img
          className="polls-item__logo"
          src={
            createdBy && createdBy.picture !== "not-found"
              ? createdBy.picture
              : profile
          }
          alt="Poll Logo"
        />
      </div>
      <div className="polls-item__body">
        <p className="polls-item__description">{poll.description}</p>
        <div className="polls-item__progress-bars">
          <ProgressBar options={poll.options} />
        </div>
      </div>
      <div className="polls-item__footer">
        <p className="polls-item__creator">
          Created by:{" "}
          <span className="polls-item__creator-name">
            {createdBy && createdBy.name}
          </span>
        </p>
        <button
          className="polls-item__details-button"
          onClick={() => navigate("/brightpolls/" + poll._id)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PollsItem;
