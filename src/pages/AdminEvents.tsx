import { useContext, useState } from "react";
import AdminTable from "../components/globals/AdminTable";
import Pagination from "../components/globals/Pagination";
import Searchbar from "../components/globals/Searchbar";
import { UserRoleContext } from "../context/context";
import "../styles/AdminEvents.component.css";
import { Event } from "../types/types";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const AdminEvents = () => {
  const [searchable, setsearchable] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const eventsPerPage = 5; 
  const pagesPerGroup = 5; 
  const role = useContext(UserRoleContext);

  if (role !== "admin") {
    window.history.back();
  }

  const handleAllEventsClick = () => {
    setSelectedEvent("all");
    setCurrentPage(1);
  };

  const handlePendingEventsClick = () => {
    setSelectedEvent("pending");
    setCurrentPage(1); // Reset to the first page when switching filters
  };

  const events: Event[] = [
    {
      title: "Tech Conference",
      description: "A conference for tech enthusiasts.",
      location: "New York",
      address: "123 Tech Street",
      startDate: new Date("2025-04-20"),
      endDate: new Date("2025-04-22"),
      createdBy: "Admin",
      attendances: [],
      declinedUsers: [],
      organizors: ["Admin"],
      validated: true,
      form: [],
      refusalReason: undefined,
      paidByBrightest: false,
      emoji: "🎉",
      _id: "event123",
    },
    {
      title: "Community Meetup",
      description: "A meetup for the local community.",
      location: "San Francisco",
      address: "456 Community Lane",
      startDate: new Date("2025-05-10"),
      endDate: new Date("2025-05-11"),
      createdBy: "Admin",
      attendances: [],
      declinedUsers: [],
      organizors: ["Admin"],
      validated: false,
      form: [],
      refusalReason: "Pending approval",
      paidByBrightest: false,
      emoji: "🤝",
      _id: "event124",
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchable.toLowerCase());
    if (selectedEvent === "all") {
      return matchesSearch;
    } else if (selectedEvent === "pending") {
      return !event.validated && matchesSearch;
    }
    return false;
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <>
      <AuthenticatedTemplate>
        <div className="adminEvents-container">
          <div className="adminEvents-header">
            <Searchbar
              search={searchable}
              setOnsearch={setsearchable}
              linkback="/admin"
            />
            <div className="adminEvents-buttons-container">
              <button
                id="adminEvents-button-all"
                onClick={handleAllEventsClick}
                className={selectedEvent === "all" ? "active" : ""}
              >
                All Events
              </button>
              <button
                id="adminEvents-button-pending"
                onClick={handlePendingEventsClick}
                className={selectedEvent === "pending" ? "active" : ""}
              >
                Pending Events
              </button>
            </div>
          </div>
          <div className="adminEvents-content">
            <AdminTable list={currentEvents as Event[]} />
            <Pagination
              setCurrentPage={setCurrentPage}
              itemsList={filteredEvents}
              itemsPerPage={eventsPerPage}
              currentPage={currentPage}
              pagesPerGroup={pagesPerGroup}
            />
          </div>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default AdminEvents;