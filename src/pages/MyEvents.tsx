import { useContext, useEffect, useState } from "react";
import EventListItem from "../components/events/EventListItem";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightEvents.component.css";
import { Event } from "../types/types";
import Pagination from "../components/globals/Pagination";
import useAccessToken from "../utilities/getAccesToken";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const { user } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [onsearch, setOnsearch] = useState<string>("");

  useEffect(() => {
    if (events) {
      setFilteredEvents(
        events.filter((event) =>
          event.title?.toLowerCase().includes(onsearch.toLowerCase()),
        ),
      );
    }
  }, [events, onsearch]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (user) {
          const token = await getAccessToken();
          const response = await fetch(
            `${server}/api/events/my-events/${user?._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data: { events: Event[] } = await response.json();
          setEvents(data.events);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, user]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents
    ? filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)
    : null;

  return (
    <>
      <AuthenticatedTemplate>
        <div className="container">
          {!dataLoaded && <FullscreenLoader content="Gathering data..." />}
          <Searchbar setOnsearch={setOnsearch} search={onsearch} />
          <div className="event_list">
            {currentEvents && currentEvents.length > 0 ? (
              currentEvents.map((event, index) => {
                return <EventListItem event={event} key={index} />;
              })
            ) : (
              <p>No events found...</p>
            )}
          </div>
          {currentEvents && currentEvents?.length > 0 ? (
            <Pagination
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              itemsList={events}
              pagesPerGroup={pagesPerGroup}
              itemsPerPage={eventsPerPage}
            />
          ) : (
            <></>
          )}
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default MyEvents;
