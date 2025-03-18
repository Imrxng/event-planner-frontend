import { CiClock2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { Event } from "../../../types/types";
import foto from "../../../assets/images/brightest_logo_small.png";
import "../../../styles/requestItem.component.css";
interface RequestItemProps {
  event: Event;
}

const DeclinedItem = ({ event }: RequestItemProps) => {
  const startDate = new Date(event.startDate);

  return (
    <>

        <div className="container_item">
          <div className="header">
          <div className="headerLeft">
            <p id="emoji">{event.emoji}</p>
            <div className="header_content">
              <h1>{event.title}</h1>
              <p>brightest location: {event.location=="all"?<>all</>:<>{event.location}</> }</p>
            </div>
            </div>
            <img src={foto} alt="" id="creatorImage"/>
          </div>
          <div className="content">
            <div className="info">
              <p className="tekstenicon">
                <MdOutlineCalendarMonth height={10} width={10} />
                {startDate.toLocaleDateString("nl-NL", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>

              <p className="tekstenicon">
                <CiClock2 height={10} width={10} />
                {startDate.toLocaleTimeString("nl-NL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="tekstenicon">
                <IoLocationOutline />
                {event.address}
              </p>
            </div>
          <p className="description">
            {event.description}
          </p>
            <p id="refusal-reason">
                <span id="bold">Reason for denial:</span> {event.refusalReason}
            </p>
          </div>
        </div>
    </>
  );
};

export default DeclinedItem;
