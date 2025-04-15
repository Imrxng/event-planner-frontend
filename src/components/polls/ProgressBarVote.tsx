import "./../../styles/pollsDetail.component.css";

interface Subject {
  id: string;
  title: string;
  votes: number;
  percentage: number;
}

interface ProgressBarVoteProps {
  subjects: Subject[];
}

const ProgressBarVote = ({ subjects }:ProgressBarVoteProps) => {
  return (
    <form action="">
      {subjects.map((subject) => (
        <div className="poll-detail__vote-item" key={subject.id}>
          <div className="poll-detail__progress-bar-tekst">
            <div className="poll-detail__progress-bar-button">
              <input
                type="radio"
                id={subject.id}
                name="title"
                value={subject.title}
              />
              <label htmlFor={subject.id}>{subject.title}</label>
            </div>
            <p>{subject.votes} votes ({subject.percentage.toPrecision(4)}%)</p>
          </div>
          <div className="poll-detail__progress-container">
            <div
              className="poll-detail__progress-bar"
              style={{ width: `${subject.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </form>
  );
};

export default ProgressBarVote;
