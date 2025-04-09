import { IoMdPerson } from "react-icons/io";
import { IoCalendarClearOutline } from "react-icons/io5";
import foto from "../assets/images/brightest_logo_small.png";
import "../styles/pollsDetail.component.css";
import ProgressBarVote from "../components/polls/ProgressBarVote";
import LinkBack from "../components/LinkBack";

const PollDetailPage = () => {

  const subjects = [
    { id: "1", title: "Option 1", votes: 10, percentage: 25 },
    { id: "2", title: "Option 2", votes: 20, percentage: 50 },
    { id: "3", title: "Option 3", votes: 5, percentage: 12.5 },
    { id: "4", title: "Option 4", votes: 5, percentage: 12.5 },
  ];

  return (
    <div className="poll-detail">
      <LinkBack href={"/brightpolls"} />
      <div className="poll-detail__card">
        <div className="poll-detail__header">
          <div>
            <h1>what topic would you like for the next tech meetup?</h1>
            <p>
              Help us choose the main topic for our upcoming technology meetup
              in march.
            </p>
          </div>
          <img src={foto} alt="" />
        </div>
        <div className="poll-detail__content">
          <br />
          <p className="poll-detail__description">
            <IoMdPerson /> created by Emma de Vries
          </p>
          <p className="poll-detail__description">
            <IoCalendarClearOutline /> created on 15-2-2024
          </p>
          <div className="poll-detail__votes">
            <ProgressBarVote subjects={subjects} />

            <div></div>
          </div>
        </div>
        <div className="poll-detail__footer">
          <p>
            Total votes: <span>{87}</span>
          </p>
          <button>Submit Vote</button>
        </div>
      </div>
    </div>
  );
};

export default PollDetailPage;
