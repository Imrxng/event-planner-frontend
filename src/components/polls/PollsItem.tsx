import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const PollsItem = ({
  poll,
}: {
  poll: {
    title: string;
    description: string;
    image: string;
    createdBy: string;
    subjects: { id: string; title: string; votes: number; percentage: number }[];
  };
}) => {
  const navigate = useNavigate();

  return (
    <div className="polls-item">
      <div className="polls-item__header">
        <h1 className="polls-item__title">{poll.title}</h1>
        <div className="polls-item__header-right">
          <button className="polls-item__report-button">Report</button>
          <img className="polls-item__logo" src={poll.image} alt="Poll Logo" />
        </div>
      </div>
      <div className="polls-item__body">
        <p className="polls-item__description">{poll.description}</p>
        <div className="polls-item__progress-bars">
          <ProgressBar subjects={poll.subjects} />
        </div>
      </div>
      <div className="polls-item__footer">
        <p className="polls-item__creator">
          Created by: <span className="polls-item__creator-name">{poll.createdBy}</span>
        </p>
        <button
          className="polls-item__details-button"
          onClick={() => navigate("/PollDetailPage")}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PollsItem;