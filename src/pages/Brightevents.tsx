import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import EventListItem from "../components/events/EventListItem";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightEvents.component.css";
import { Event } from "../types/types";

const Brightevents = () => {
  const [events, setEvents] = useState<Event[]>();
  const [loading, SetLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const userMongoDb = useContext(UserContext);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [onsearch, setOnsearch] = useState<string>("");

  const filteredEvents = () => {
    if (events != undefined) {
      return events.filter((event) => {
        return event.title.toLowerCase().includes(onsearch.toLowerCase());
      });
    }
    return [];
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        SetLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${server}/api/events/${userMongoDb?.location}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setEvents(data.events);
        SetLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, [getAccessTokenSilently, server, userMongoDb]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const eventsfilter = filteredEvents();
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventsfilter?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = eventsfilter
    ? Math.ceil(eventsfilter.length / eventsPerPage)
    : 0;

  const getPaginationRange = () => {
    const startPage = Math.max(currentPage - Math.floor(pagesPerGroup / 2), 1);
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
    return { startPage, endPage };
  };

  const { startPage, endPage } = getPaginationRange();

  return (
    <div className="container">
      {loading && !isLoading ? (
        <FullscreenLoader content="Gathering data..." />
      ) : (
        <></>
      )}
      <Searchbar setOnsearch={setOnsearch} search={onsearch} />
      <div className="event_list">
        {currentEvents && currentEvents.length > 0 ? (
          currentEvents.map((event, index) => {
            return <EventListItem event={event} key={index} />;
          })
        ) : (
          <p>no events found...</p>
        )}
      </div>
      {currentEvents && currentEvents?.length > 0 ? (
        <div className="pagination">
          <button
            className="nav-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <IoMdArrowBack />
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(startPage + index)}
              disabled={currentPage === startPage + index}
              className={`numbers-button ${
                currentPage === startPage + index ? "current-page" : ""
              }`}
            >
              {startPage + index}
            </button>
          ))}
          <button
            className="nav-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <IoMdArrowForward />
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const BrighteventsPage = withAuthenticationRequired(Brightevents, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default BrighteventsPage;
