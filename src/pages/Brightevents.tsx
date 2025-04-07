import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { SetStateAction, useContext, useEffect, useState } from "react";
import EventListItem from "../components/events/EventListItem";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightEvents.component.css";
import { Event } from "../types/types";
import LocationSelector from "../components/globals/LocationSelector";

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
  const [locatiefilter, setLocatiefilter] = useState<string>(userMongoDb?.location? userMongoDb?.location : "All");

  useEffect(() => {
    if (userMongoDb?.location) {
      setLocatiefilter(userMongoDb.location);
    }
  }, [userMongoDb?.location]);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (events) {
      setFilteredEvents(
        events
          .filter((event) => event.title?.toLowerCase().startsWith(onsearch.toLowerCase()))
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      );
    }
  }, [onsearch, events]);
  
  useEffect(() => {
    if (!userMongoDb) {
      return;
    }
    const fetchEvents = async () => {
      try {
        
        SetLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${server}/api/events/${locatiefilter}`,
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
    setCurrentPage(1);
  }, [getAccessTokenSilently, server, userMongoDb,locatiefilter]);



  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents?.slice(
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
      <LocationSelector locatiefilter={locatiefilter} setLocatiefilter={setLocatiefilter} />
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
        <Pagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          events={filteredEvents}
          pagesPerGroup={pagesPerGroup}
          eventsPerPage={eventsPerPage}
        />
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
