import { Option } from "../../types/types";
import "./../../styles/pollsDetail.component.css";

interface ProgressBarVoteProps {
  options: Option[];
  selectedOption: string | null;
  onSelectOption: (text: string) => void;
}

const ProgressBarVote = ({
  options,
  selectedOption,
  onSelectOption,
}: ProgressBarVoteProps) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <form>
      {options.map((option, index) => {
        const percentage =
          totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        const optionId = option.text;

        return (
          <div className="poll-detail__vote-item" key={index}>
            <div className="poll-detail__progress-bar-tekst">
              <div className="poll-detail__progress-bar-button">
                <input
                  type="radio"
                  id={optionId}
                  name="pollOption"
                  value={optionId}
                  checked={selectedOption === optionId}
                  onChange={() => onSelectOption(optionId)}
                />
                <label htmlFor={optionId}>{option.text}</label>
              </div>
              <p>
                {option.votes} {option.votes === 1 ? "vote" : "votes"} (
                {percentage.toFixed(2)}%)
              </p>
            </div>
            <div className="poll-detail__progress-container">
              <div
                className="poll-detail__progress-bar"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </form>
  );
};

export default ProgressBarVote;
