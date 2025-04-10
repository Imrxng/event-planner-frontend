import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useContext, useState } from "react";
import Searchbar from "../components/globals/Searchbar";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { UserRoleContext } from "../context/context";
import "../styles/AdminEvents.component.css";

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
            style={{
              backgroundColor: selectedEvent === "all" ? "darkgray" : "var(--main-yellow-color)",
              color: selectedEvent === "all" ? "white" : "black",
            }}
          >
            All Events
          </button>
          <button
            id="adminEvents-button-pending"
            onClick={handlePendingEventsClick}
            style={{
              backgroundColor:
                selectedEvent === "pending" ? "darkgray" : "var(--main-yellow-color)",
              color: selectedEvent === "pending" ? "white" : "black",
            }}
          >
            Pending Events
          </button>
        </div>
      </div>
      <div className="adminEvents-content"></div>
      <h1>{selectedEvent}</h1>
    </div>
  );
};

const AdminEventsPage = withAuthenticationRequired(AdminEvents, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default AdminEventsPage;
