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
  const [currentGroup, setCurrentGroup] = useState(0);
  const eventsPerPage = 6;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const userMongoDb = useContext(UserContext);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [onsearch, setOnsearch] = useState<string>("");

  const filteredEvents = () => {
    if(events != undefined){
        return events.filter((event) => {
          return event.title.toLowerCase().includes(onsearch.toLowerCase());
        });
    }
    if(events === undefined) return;
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

  const handleNextGroup = () => {
    setCurrentGroup(currentGroup + 1);
  };

  const handlePreviousGroup = () => {
    setCurrentGroup(currentGroup - 1);
  };
  const eventsfilter= filteredEvents();
  
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventsfilter? eventsfilter.slice(indexOfFirstEvent, indexOfLastEvent): null;
  const totalPages = eventsfilter ? Math.ceil(eventsfilter.length / eventsPerPage) : 0;
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);

  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  return (
    <div className="container">
      {loading && !isLoading ? (
        <FullscreenLoader content="Gathering data..." />
      ) : (
        <></>
      )}
      <Searchbar setOnsearch={setOnsearch} search={onsearch} />
      <div className="eventItems_container">
        {currentEvents && currentEvents.length > 0 ? (
          currentEvents.map((event, index) => {
            return <EventListItem event={event} key={index} />;
          })
        ) : (
          <p>no events found...</p>
        )}
        {currentEvents && currentEvents?.length > 0 ? (
          <div className="pagination">
        <button
          className="nav-button"
          onClick={handlePreviousGroup}
          disabled={currentGroup === 0}
        >
          <IoMdArrowBack />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(startPage + index)}
            disabled={currentPage === startPage + index}
            className="numbers-button"
          >
            {startPage + index}
          </button>
        ))}
        <button
          className="nav-button"
          onClick={handleNextGroup}
          disabled={currentGroup >= totalGroups - 1}
        >
          <IoMdArrowForward />
        </button>
      </div>
          ):<></>}
      </div>
    </div>
  );
};

const BrighteventsPage = withAuthenticationRequired(Brightevents, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default BrighteventsPage;
