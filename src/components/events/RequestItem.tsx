import { MdOutlineCalendarMonth } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineRight } from "react-icons/ai";
import "../../styles/requestItem.component.css";
import { Event } from "../../types/types";
interface RequestItemProps {
  event: Event;
}

const RequestItem = ({ event }: RequestItemProps) => {
  const startDate = new Date(event.startDate);

  return (
    <>

        <div className="container_item">

          <div className="header">
            <p id="emoji">{event.emoji}</p>
            
            <div className="header_content">
              <h1>{event.title}</h1>
              <p>Requested by {event.createdBy}</p>
            </div>
          </div>
          <div className="content">
            <div className="info">
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
              <p>
                <IoLocationOutline />
                {event.address}
              </p>
            </div>

            <button onClick={() => alert("hey imran")} className="button">
              cancel
            </button>
          </div>
        </div>
    </>
  );
};

export default RequestItem;
