import { CiClock2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { Event } from "../../../types/types";
import "../../../styles/requestItem.component.css";
import { RiDeleteBinLine } from "react-icons/ri";
import { useContext, useState } from "react";
import ConfirmModal from "../../../modals/ConfirmModal";
import useAccessToken from "../../../utilities/getAccesToken";
import { UserContext } from "../../../context/context";
interface RequestItemProps {
  event: Event;
  setEvents: React.Dispatch<React.SetStateAction<Event[] | undefined>>;
  events: Event[] | undefined;
}

const DeclinedItem = ({ event, setEvents, events }: RequestItemProps) => {
  const [cancelRequestOpen, setCancelRequestOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useContext(UserContext);
  const { getAccessToken } = useAccessToken();
  const server = import.meta.env.VITE_SERVER_URL;
  const startDate = new Date(event.startDate);
  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      setErrorMessage("");
      const token = await getAccessToken();
      const response = await fetch(`${server}/api/events/${event._id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSuccessMessage("Your request has been successfully canceled.");
      setEvents(events && events.filter((item) => event._id !== item._id));
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setCancelRequestOpen(false);
    setSuccessMessage(null);
    setErrorMessage(null);
  };
  return (
    <>
      {cancelRequestOpen && (
        <ConfirmModal
          onClose={() => handleClose()}
          title={event.title}
          onConfirm={clickHandler}
          loading={loading}
          confirmText="Confirm"
          successMessage={successMessage}
          errorMessage={errorMessage}
          content={"Are you sure you want to cancel your request?"}
        />
      )}
      <div className="container_item">
        <div className="header">
          <div className="headerLeft">
            <p id="emoji">{event.emoji}</p>
            <div className="header_content">
              <h1>{event.title}</h1>
              <p>
                Region:{" "}
                {event.location == "all" ? <>all</> : <>{event.location}</>}
              </p>
            </div>
          </div>
          <RiDeleteBinLine
            id="creatorImage"
            onClick={() => setCancelRequestOpen(true)}
          />
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
          <p className="description">{event.description}</p>
          <p id="refusal-reason">
            <span id="bold">Reason for denial:</span> {event.refusalReason}
          </p>
        </div>
      </div>
    </>
  );
};

export default DeclinedItem;
