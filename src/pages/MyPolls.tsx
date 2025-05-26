import { useContext, useEffect, useState } from "react";
import Pagination from "../components/globals/Pagination";
import PollsItem from "../components/polls/PollsItem";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightPolls.component.css";
import { Poll } from "../types/types";
import Searchbar from "../components/globals/Searchbar";
import useAccessToken from "../utilities/getAccesToken";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const MyPolls = () => {
  const [search, setOnSearch] = useState<string>("");
  const [loading, SetLoading] = useState<boolean>(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const { loadingUser, user } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();
  const server = import.meta.env.VITE_SERVER_URL;

  const [filteredEvents, setFilteredEvents] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        if (!user) {
          return;
        }
        SetLoading(true);
        const token = await getAccessToken();
        const response = await fetch(
          `${server}/api/polls/my-polls/${user._id}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch poll data");
        }

        const data = await response.json();
        setPolls(data.polls);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        SetLoading(false);
      }
    };

    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, user]);

  useEffect(() => {
    if (polls) {
      const filteredAndSearched = polls.filter((poll) =>
        poll.question.toLowerCase().startsWith(search.toLowerCase()),
      );

      setFilteredEvents(
        filteredAndSearched.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      );
    }
  }, [polls, search]);

  const [currentPage, setCurrentPage] = useState(1);
  const pollsPerPage = 2;
  const pagesPerGroup = 4;

  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = filteredEvents.slice(indexOfFirstPoll, indexOfLastPoll);

  return (
    <>
      <AuthenticatedTemplate>
        <div className="polls_container">
          {loading && !loadingUser ? (
            <FullscreenLoader content="Gathering data..." />
          ) : null}
          <div>
            <Searchbar search={search} setOnsearch={setOnSearch} linkback="/" />
          </div>
          {filteredEvents.length > 0 ? (
            <div className="polls_content">
              {currentPolls.map((poll, index) => (
                <PollsItem key={index} poll={poll} />
              ))}
            </div>
          ) : (
            <p>No polls found...</p>
          )}
          {filteredEvents.length > 0 && (
            <Pagination
              setCurrentPage={setCurrentPage}
              itemsList={filteredEvents}
              itemsPerPage={pollsPerPage}
              currentPage={currentPage}
              pagesPerGroup={pagesPerGroup}
            />
          )}
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default MyPolls;
