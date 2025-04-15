import { useContext, useState } from "react";
import foto from "../assets/images/brightest_logo_small.webp";
import Pagination from "../components/globals/Pagination";
import LinkBack from "../components/LinkBack";
import PollsItem from "../components/polls/PollsItem";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightPolls.component.css";

const BrightPolls = () => {
  const [loading, SetLoading] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const pollslijst = [
    {
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
      declinedUsers: [],
      organizors: ["John Doe"],
      validated: true,
      form: null,
      createdAt: "2025-04-01",
      updatedAt: "2025-04-05",
    },
    {
      title: "Which programming language should we focus on next?",
      description: "Vote for the programming language you'd like to learn more about.",
      image: foto,
      createdBy: "Jane Smith",
      location: "Conference Room A",
      address: "456 Developer Lane",
      startDate: "2025-05-01",
      endDate: "2025-05-02",
      attendances: 150,
      subjects: [
        { id: "1", title: "JavaScript", votes: 30, percentage: 60 },
        { id: "2", title: "Python", votes: 15, percentage: 30 },
        { id: "3", title: "Go", votes: 5, percentage: 10 },
      ],
      declinedUsers: [],
      organizors: ["Jane Smith"],
      validated: true,
      form: null,
      createdAt: "2025-04-15",
      updatedAt: "2025-04-20",
    },
    {
      title: "What is your favorite frontend framework?",
      description: "Help us decide which framework to use for our next project.",
      image: foto,
      createdBy: "Alice Johnson",
      location: "Online",
      address: "789 Framework Blvd",
      startDate: "2025-06-15",
      endDate: "2025-06-16",
      attendances: 200,
      subjects: [
        { id: "1", title: "React", votes: 40, percentage: 50 },
        { id: "2", title: "Vue", votes: 30, percentage: 37.5 },
        { id: "3", title: "Angular", votes: 10, percentage: 12.5 },
      ],
      declinedUsers: [],
      organizors: ["Alice Johnson"],
      validated: true,
      form: null,
      createdAt: "2025-05-01",
      updatedAt: "2025-05-10",
    },
    {
      title: "What is the best time for our weekly team meeting?",
      description: "Vote for the time that works best for you.",
      image: foto,
      createdBy: "Bob Brown",
      location: "Office Meeting Room",
      address: "101 Teamwork Ave",
      startDate: "2025-07-01",
      endDate: "2025-07-01",
      attendances: 50,
      subjects: [
        { id: "1", title: "Morning", votes: 20, percentage: 40 },
        { id: "2", title: "Afternoon", votes: 25, percentage: 50 },
        { id: "3", title: "Evening", votes: 5, percentage: 10 },
      ],
      declinedUsers: [],
      organizors: ["Bob Brown"],
      validated: true,
      form: null,
      createdAt: "2025-06-01",
      updatedAt: "2025-06-05",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const pollsPerPage = 2;
  const pagesPerGroup = 4;

  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = pollslijst.slice(indexOfFirstPoll, indexOfLastPoll);

  return (
    <div className="polls_container">
      {loading && !isLoading ? (
        <FullscreenLoader content="Gathering data..." />
      ) : (
        <></>
      )}
      <LinkBack href={"/"} />
      <div className="polls_content">
        {currentPolls.map((poll, index) => (
          <PollsItem key={index} poll={poll} />
        ))}
      </div>
      <Pagination
        setCurrentPage={setCurrentPage}
        itemsList={pollslijst}
        itemsPerPage={pollsPerPage}
        currentPage={currentPage}
        pagesPerGroup={pagesPerGroup}
      />
    </div>
  );
};

export default BrightPolls;
