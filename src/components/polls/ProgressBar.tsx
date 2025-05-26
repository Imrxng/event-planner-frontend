import { Option } from "../../types/types";
import "./../../styles/pollsItem.component.css";

interface ProgressBarProps {
  options: Option[];
}

const ProgressBar = ({ options }: ProgressBarProps) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="progress-bar">
      {options.map((option) => {
        const percentage =
          totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

        return (
          <div key={option.text} className="progress-bar__item">
            <div className="progress-bar__header">
              <p className="progress-bar__title">{option.text}</p>
              <p className="progress-bar__votes">
                {option.votes} {option.votes === 1 ? "vote" : "votes"}
              </p>
            </div>

            <div className="progress-bar__container">
              <div
                className="progress-bar__fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
