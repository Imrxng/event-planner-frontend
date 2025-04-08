import "./../../styles/pollsItem.component.css";

const ProgressBar = ({
  voteAmount,
  title,
}: {
  title: string;
  voteAmount: number;
}) => {
  return (
    <div >
      <div className="progress-bar-title">
        <p></p>
        <p>{voteAmount} votes</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${voteAmount}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
