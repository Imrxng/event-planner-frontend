import { Link, useLocation } from "react-router-dom";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineRight } from "react-icons/ai";
import "../../styles/brightListItem.component.css";
import { Event } from "../../types/types";
import { PiBuildingOffice } from "react-icons/pi";
interface EventItemProps {
  event: Event;
}

const EventListItem = ({ event }: EventItemProps) => {
  const startDate = new Date(event.startDate);
  const location = useLocation();
  return (
    <>
      <div className="eventItem_container">
        <div className="eventItem_header">
          <p id="eventItem_emoji">{event.emoji}</p>
          <p></p>
          <div className="eventItem_header_content">
            <p>
              <MdOutlineCalendarMonth height={10} width={10} />
              {startDate.toLocaleDateString("nl-NL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>

            <p>
              <CiClock2 height={10} width={10} />
              {startDate.toLocaleTimeString("nl-NL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="eventItem_content">
          <h1>{event.title}</h1>
          <div>
            <p>
              <IoLocationOutline />
              {event.address}
            </p>
            <p>
              <PiBuildingOffice />{" "}
              {event.location == "all" ? (
                <>All regions</>
              ) : (
                <>{event.location}</>
              )}
            </p>
          </div>
        </div>
        <Link
          to={`/brightevents/${event._id}`}
          state={{ linkBack: location.pathname }}
          className="eventItem_button"
        >
          See more
          <AiOutlineRight className="eventItem_iconbutton" />
        </Link>
      </div>
    </>
  );
};

export default EventListItem;
