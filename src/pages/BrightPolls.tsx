import React, { useContext, useEffect, useState } from "react";
import LinkBack from "../components/LinkBack";
import "../styles/brightPolls.component.css";
import { useAuth0 } from "@auth0/auth0-react";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import PollsItem from "../components/polls/PollsItem";
import foto from "../assets/images/brightest_logo_small.png";

const BrightPolls = () => {
  const [loading, SetLoading] = useState<boolean>(false);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [polls, setPolls] = useState<Event[]>();
  const server = import.meta.env.VITE_SERVER_URL;
  const userMongoDb = useContext(UserContext);

  const poll = {
    title: "What topic would you like for the next tech meetup?",
    description: "Help us choose the main topic for our upcoming technology meetup in March.",
    image: foto,
    createdBy: "John Doe",
    subjects: [
      { id: "1", title: "Option 1", votes: 10, percentage: 25 },
      { id: "2", title: "Option 2", votes: 20, percentage: 50 },
      { id: "3", title: "Option 3", votes: 5, percentage: 12.5 },
      { id: "4", title: "Option 4", votes: 5, percentage: 12.5 },
    ],
  };

  // useEffect(() => {
  //   const fetchpolls = async () => {
  //     try {
  //       SetLoading(true);
  //       const token = await getAccessTokenSilently();
  //       const response = await fetch(
  //         `${server}/api/polls/${userMongoDb?.location}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const data = await response.json();
  //       setPolls(data.polls);
  //       SetLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchpolls();
  // }, [getAccessTokenSilently, server, userMongoDb]);

  return (
    <div className="polls_container">
      {loading && !isLoading ? (
        <FullscreenLoader content="Gathering data..." />
      ) : (
        <></>
      )}
      <LinkBack href={"/"} />
      <div className="polls_content">
        <PollsItem poll={poll} />
      </div>
    </div>
  );
};

export default BrightPolls;
