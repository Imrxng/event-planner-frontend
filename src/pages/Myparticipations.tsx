import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import React, { useContext, useEffect, useState } from "react";
import EventListItem from "../components/events/EventListItem";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightEvents.component.css";
import { Event } from "../types/types";
import Pagination from "../components/globals/Pagination";

const Myparticipations = () => {
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
    if (events === undefined) return;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        SetLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${server}/api/events/participations/${userMongoDb?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
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
  const currentEvents = eventsfilter
    ? eventsfilter.slice(indexOfFirstEvent, indexOfLastEvent)
    : null;

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
          <p>No participations found...</p>
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
const MyparticipationsPage = withAuthenticationRequired(Myparticipations, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});
export default MyparticipationsPage;
