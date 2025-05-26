import { useContext, useEffect, useState } from "react";
import EventListItem from "../components/events/EventListItem";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/brightEvents.component.css";
import { Event } from "../types/types";
import useAccessToken from "../utilities/getAccesToken";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const Brightevents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const { user } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();
  const [onsearch, setOnsearch] = useState<string>("");
  const [locatiefilter, setLocatiefilter] = useState<string>(
    user?.location ?? "all",
  );
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user?.location === "all") {
      setLocatiefilter("all");
    } else {
      setLocatiefilter(user?.location ?? "all");
    }
  }, [user?.location]);

  useEffect(() => {
    const initialize = async () => {
      if (!user) {
        return;
      }
      try {
        setReady(false);
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/events/${user.location}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setReady(true);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, server]);

  useEffect(() => {
    setOnsearch("");
  }, [locatiefilter]);

  useEffect(() => {
    if (events) {
      const filteredByLocation =
        locatiefilter === "all"
          ? events
          : events.filter(
              (event) =>
                event.location === locatiefilter ||
                (user?.location !== "all" && event.location === "all"),
            );

      const filteredAndSearched = filteredByLocation.filter((event) =>
        event.title?.toLowerCase().startsWith(onsearch.toLowerCase()),
      );

      setFilteredEvents(
        filteredAndSearched.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, locatiefilter, onsearch]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent,
  );

  return (
    <>
      <AuthenticatedTemplate>
        <div className="container">
          {!ready ? (
            <FullscreenLoader content="Gathering data..." />
          ) : (
            <>
              <Searchbar
                setOnsearch={setOnsearch}
                search={onsearch}
                locatiefilter={locatiefilter}
                setLocatiefilter={setLocatiefilter}
              />
              <div className="event_list">
                {currentEvents.length > 0 ? (
                  currentEvents.map((event, index) => (
                    <EventListItem event={event} key={index} />
                  ))
                ) : (
                  <p>No events found...</p>
                )}
              </div>
              {currentEvents.length > 0 && (
                <Pagination
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  itemsList={filteredEvents}
                  pagesPerGroup={pagesPerGroup}
                  itemsPerPage={eventsPerPage}
                />
              )}
            </>
          )}
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default Brightevents;
