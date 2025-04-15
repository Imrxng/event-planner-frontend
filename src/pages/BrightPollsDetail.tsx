import { IoMdPerson } from "react-icons/io";
import { IoCalendarClearOutline } from "react-icons/io5";
import foto from "../assets/images/brightest_logo_small.webp";
import LinkBack from "../components/LinkBack";
import ProgressBarVote from "../components/polls/ProgressBarVote";
import "../styles/pollsDetail.component.css";

const BrightPollsDetail = () => {
  const poll = {
    title: "What topic would you like for the next tech meetup?",
    description: "Help us choose the main topic for our upcoming technology meetup in March.",
    image: foto,
    createdBy: "John Doe",
    location: "Online",
    address: "123 Tech Street",
    startDate: "2025-04-10",
    endDate: "2025-04-11",
    attendances: 100,
    subjects: [
      { id: "1", title: "Option 1", votes: 10, percentage: 25 },
      { id: "2", title: "Option 2", votes: 20, percentage: 50 },
      { id: "3", title: "Option 3", votes: 5, percentage: 12.5 },
      { id: "4", title: "Option 4", votes: 5, percentage: 12.5 },
    ],
  };

  return (
    <div className="poll-detail">
      <LinkBack href={"/brightpolls"} />
      <div className="poll-detail__card">
        <div className="poll-detail__header">
          <div>
            <h1>{poll.title}</h1>
            <p>{poll.description}</p>
          </div>
          <img src={poll.image} alt="Poll" />
        </div>
        <div className="poll-detail__content">
          <br />
          <p className="poll-detail__description">
            <IoMdPerson /> Created by {poll.createdBy}
          </p>
          <p className="poll-detail__description">
            <IoCalendarClearOutline /> Start Date: {poll.startDate}
          </p>
          <div className="poll-detail__votes">
            <ProgressBarVote subjects={poll.subjects} />
          </div>
        </div>
        <div className="poll-detail__footer">
          <p>
            Total votes: <span>{poll.subjects.reduce((acc, subject) => acc + subject.votes, 0)}</span>
          </p>
          <button>Submit Vote</button>
        </div>
      </div>
    </div>
  );
};

export default BrightPollsDetail;
