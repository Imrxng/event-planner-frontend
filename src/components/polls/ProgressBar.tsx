import "./../../styles/pollsItem.component.css";

const ProgressBar = ({
  subjects,
}: {
  subjects: { id: string; title: string; votes: number; percentage: number }[];
}) => {
  return (
    <div className="progress-bar">
      {subjects.map((subject) => (
        <div key={subject.id} className="progress-bar__item">
          <div className="progress-bar__header">
            <p className="progress-bar__title">{subject.title}</p>
            <p className="progress-bar__votes">{subject.votes} votes</p>
          </div>

          <div className="progress-bar__container">
            <div
              className="progress-bar__fill"
              style={{ width: `${subject.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
