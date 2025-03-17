import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import LinkBack from "../components/LinkBack";
import ParticipationMenu from "../components/globals/Participationmenu";
import "../styles/request.component.css";
import { UserContext } from "../context/context";
import RequestItem from "../components/events/RequestItem";
import { Event } from "../types/types";

const Myrequests = () => {
  const [events, setEvents] = useState<Event[]>();
  const [loading, SetLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 2;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const userMongoDb = useContext(UserContext);
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [onsearch, setOnsearch] = useState<string>("");

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

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events?.slice(indexOfFirstEvent, indexOfLastEvent);

  const links = [
    { to: "/requests", text: "Recents requests" },
    { to: "/", text: "Denied requests" },
    { to: "/", text: "New requests" },
  ];
  return (
    <div className="container">
      {loading && !isLoading ? (
        <FullscreenLoader content="Gathering data..." />
      ) : (
        <></>
      )}
      <div className="header_menu">
        <LinkBack href={"/"} />
        <ParticipationMenu links={links} />
      </div>
      <div className="main_container">
        {currentEvents && currentEvents.length > 0 ? (
          currentEvents.map((event, index) => {
            return <RequestItem event={event} key={index} />;
          })
        ) : (
          <p>no requests found...</p>
        )}
      </div>
      <div className="Pagination"></div>
    </div>
  );
};
const MyrequestsPage = withAuthenticationRequired(Myrequests, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});
export default Myrequests;
