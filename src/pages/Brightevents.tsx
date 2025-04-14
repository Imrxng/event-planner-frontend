import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import EventListItem from "../components/events/EventListItem";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightEvents.component.css";
import { Event } from "../types/types";

const Brightevents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, SetLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const userMongoDb = useContext(UserContext);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [onsearch, setOnsearch] = useState<string>("");
  const [locatiefilter, setLocatiefilter] = useState<string>("");

  useEffect(() => {
    if (userMongoDb?.location) {
      setLocatiefilter(userMongoDb.location);
    }
  }, [userMongoDb?.location]);

  const filteredEvents = () => {
    if (events != undefined) {
      return events.filter((event) => {
        return event.title.toLowerCase().startsWith(onsearch.toLowerCase());
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


  const eventsfilter = filteredEvents();
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventsfilter?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

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
       <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} itemsList={events} pagesPerGroup={pagesPerGroup} itemsPerPage={eventsPerPage}/>
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
