import { useContext, useEffect, useState } from "react";
import AdminTable from "../components/globals/AdminTable";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import { UserContext, UserRoleContext } from "../context/context";
import "../styles/AdminEvents.component.css";
import { Event } from "../types/types";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";
import useAccessToken from "../utilities/getAccesToken";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { useLocation } from "react-router-dom";
import RefuseEventAdminModal from "../modals/RefuseEventAdminModal";
import ApproveEventModal from "../modals/ApproveEventModal";

const AdminEvents = () => {
  const [searchable, setsearchable] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [popupRefusalEvent, setPopupRefusalEvent] = useState<boolean>(false);
  const [popupApproveEvent, setPopupApproveEvent] = useState<boolean>(false);
  const [selectedItemEvent, setSelectedItemEvent] = useState<Event | null>(
    null,
  );

  const role = useContext(UserRoleContext);
  const { user, loadingUser } = useContext(UserContext);
  const { inProgress } = useMsal();
  const { getAccessToken } = useAccessToken();
  const location = useLocation();
  const server = import.meta.env.VITE_SERVER_URL;

  const eventsPerPage = 5;
  const pagesPerGroup = 5;

  useEffect(() => {
    const initialize = async () => {
      if (!user) {
        return;
      }
      try {
        setLoading(true);
        const token = await getAccessToken();
        const response = await fetch(
          `${server}/api/events/admin-all/${user._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        const sortedEvents = data.events.sort((a: Event, b: Event) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateB.getTime() - dateA.getTime();
        });
        setsearchable(location.state?.search || "");
        setSelectedEvent(location.state?.filter || "all");
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, server]);

  const handleAllEventsClick = () => {
    setSelectedEvent("all");
    setCurrentPage(1);
  };

  const handlePendingEventsClick = () => {
    setSelectedEvent("pending");
    setCurrentPage(1);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchable.toLowerCase());
    const matchesStatus =
      (selectedEvent === "all" && event.validated) ||
      (selectedEvent === "pending" && !event.validated);
    return matchesSearch && matchesStatus;
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent,
  );

  return (
    <>
      {inProgress === "login" && <FullscreenLoader content="Logging in..." />}
      <AuthenticatedTemplate>
        {role !== "admin" && !loadingUser ? (
          <Unauthorized />
        ) : (
          <div className="adminEvents-container">
            {loading && <FullscreenLoader content="Gathering data..." />}
            <div className="adminEvents-header">
              <Searchbar
                search={searchable}
                setOnsearch={setsearchable}
                linkback="/brightadmin"
              />
            </div>
            <div className="adminEvents-content">
              <div className="adminEvents-buttons-container">
                <button
                  id="adminEvents-button-all"
                  onClick={handleAllEventsClick}
                  className={selectedEvent === "all" ? "active" : ""}
                >
                  Live Events
                </button>
                <button
                  id="adminEvents-button-pending"
                  onClick={handlePendingEventsClick}
                  className={selectedEvent === "pending" ? "active" : ""}
                >
                  Pending Events
                </button>
              </div>
              {popupRefusalEvent && (
                <RefuseEventAdminModal
                  events={events}
                  setEvents={setEvents}
                  onClose={setPopupRefusalEvent}
                  event={selectedItemEvent}
                />
              )}
              {popupApproveEvent && (
                <ApproveEventModal
                  setEvents={setEvents}
                  onClose={setPopupApproveEvent}
                  event={selectedItemEvent}
                />
              )}
              <AdminTable
                list={currentEvents as Event[]}
                setPopupRefusalEvent={setPopupRefusalEvent}
                setPopupApproveEvent={setPopupApproveEvent}
                setSelectedEvent={setSelectedItemEvent}
              />
              {filteredEvents.length > 0 && (
                <Pagination
                  setCurrentPage={setCurrentPage}
                  itemsList={filteredEvents}
                  itemsPerPage={eventsPerPage}
                  currentPage={currentPage}
                  pagesPerGroup={pagesPerGroup}
                />
              )}
            </div>
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default AdminEvents;
