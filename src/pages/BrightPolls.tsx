import React, { useContext, useEffect, useState } from "react";
import LinkBack from "../components/LinkBack";
import "../styles/brightPolls.component.css";
import { useAuth0 } from "@auth0/auth0-react";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import PollsItem from "../components/polls/PollsItem";

const BrightPolls = () => {
  const [loading, SetLoading] = useState<boolean>(false);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [polls, setPolls] = useState<Event[]>();
  const server = import.meta.env.VITE_SERVER_URL;
  const userMongoDb = useContext(UserContext);

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
        <PollsItem />
        <PollsItem />
      </div>
    </div>
  );
};

export default BrightPolls;
