import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import LinkBack from "../components/LinkBack";
import DeclinedItem from "../components/events/requests/DeclinedItem";
import ParticipationMenu from "../components/globals/Participationmenu";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/request.component.css";
import { Event } from "../types/types";
import Pagination from "../components/globals/Pagination";

const Declinedrequests = () => {
  const [events, setEvents] = useState<Event[]>();
  const [loading, SetLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 2;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const userMongoDb = useContext(UserContext);
  const { getAccessTokenSilently, isLoading } = useAuth0();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        SetLoading(true);
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${server}/api/events/my-event-requests-denied/${userMongoDb?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        
        setEvents(data.deniedRequests);
        SetLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, [getAccessTokenSilently, server, userMongoDb]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const links = [
    { to: "/brightevents/requests", text: "Recents requests" },
    { to: "/brightevents/requests/declined", text: "Declined requests" },
    { to: "/brightevents/requests/new", text: "New request" }
  ];
  return (
    <div className="requestcontainer">
      {loading && !isLoading ? (
        <FullscreenLoader content="Gathering data..." />
      ) : (
        <></>
      )}
      <div className="request-header_menu">
        <LinkBack href={"/"} />
        <ParticipationMenu links={links} />
      </div>
      <div className="request-main_container">
        {currentEvents && currentEvents.length > 0 ? (
          currentEvents.map((event, index) => {
            return <DeclinedItem event={event} key={index} />;
          })
        ) : (
          <p>no requests found...</p>
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
const MyrequestsPage = withAuthenticationRequired(Declinedrequests, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});
export default MyrequestsPage;
