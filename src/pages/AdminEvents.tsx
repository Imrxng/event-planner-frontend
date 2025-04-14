import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import AdminTable from "../components/globals/AdminTable";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserRoleContext } from "../context/context";
import "../styles/AdminEvents.component.css";
import { Event } from "../types/types";

const AdminEvents = () => {
  const [searchable, setsearchable] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const role = useContext(UserRoleContext);

  if (role !== "admin") {
    window.history.back();
  }

  const handleAllEventsClick = () => {
    setSelectedEvent("all");
  };

  const handlePendingEventsClick = () => {
    setSelectedEvent("pending");
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

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().startsWith(searchable.toLowerCase())
  );

  return (
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
        <AdminTable list={filteredEvents as Event[]} />
      </div>
    </div>
  );
};

const AdminEventsPage = withAuthenticationRequired(AdminEvents, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default AdminEventsPage;
