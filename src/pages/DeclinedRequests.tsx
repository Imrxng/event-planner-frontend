import { useContext, useEffect, useState } from "react";
import LinkBack from "../components/LinkBack";
import DeclinedItem from "../components/events/requests/DeclinedItem";
import ParticipationMenu from "../components/globals/Participationmenu";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserContext } from "../context/context";
import "../styles/request.component.css";
import { Event } from "../types/types";
import Pagination from "../components/globals/Pagination";
import useAccessToken from "../utilities/getAccesToken";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const Declinedrequests = () => {
  const [events, setEvents] = useState<Event[]>();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 2;
  const pagesPerGroup = 4;
  const server = import.meta.env.VITE_SERVER_URL;
  const { user } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (user) {
          const token = await getAccessToken();
          const response = await fetch(
            `${server}/api/events/my-event-requests-denied/${user?._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await response.json();
          setEvents(data.deniedRequests);
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
  const currentEvents = events?.slice(indexOfFirstEvent, indexOfLastEvent);

  const links = [
    { to: "/brightevents/requests", text: "Recents requests" },
    { to: "/brightevents/requests/declined", text: "Declined requests" },
    { to: "/brightevents/requests/new", text: "New request" },
  ];

  if (!dataLoaded) return <FullscreenLoader content="Gathering data..." />;

  return (
    <>
      <AuthenticatedTemplate>
        <div className="requestcontainer">
          <div className="request-header_menu">
            <LinkBack href={"/"} />
            <ParticipationMenu links={links} />
          </div>
          <div className="request-main_container">
            {currentEvents && currentEvents.length > 0 ? (
              currentEvents.map((event, index) => {
                return (
                  <DeclinedItem
                    event={event}
                    key={index}
                    events={events}
                    setEvents={setEvents}
                  />
                );
              })
            ) : (
              <p>no requests found...</p>
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

export default Declinedrequests;
