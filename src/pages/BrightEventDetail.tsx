import FullscreenLoader from "../components/spinner/FullscreenLoader";
import "../styles/BrightEventDetail.component.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Attendance, Event, MongoDbUser } from "../types/types";
import { useContext, useEffect, useState } from "react";
import LinkBack from "../components/LinkBack";
import { IoDownloadOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { PiArrowRightThin } from "react-icons/pi";
import FormModal from "../modals/FormModal";
import { UserContext } from "../context/context";
import { RxCross1 } from "react-icons/rx";
import CancelAttendanceModal from "../modals/CancelAttendanceModal";
import { GoPeople } from "react-icons/go";
import RejectEventModal from "../modals/RejectEventModal";
import CancelRejectEventModal from "../modals/CancelRejectEventModal";
import profile from "../assets/images/profile.webp";
import ReportModal from "../modals/ReportModal";
import DeleteEventModal from "../modals/DeleteEventModal";
import { saveAs } from "file-saver";
import DownloadModal from "../modals/DownloadModal";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import useAccessToken from "../utilities/getAccesToken";
import Unauthorized from "../components/Unauthorized";
import ShareButton from "../components/globals/ShareButton";
import { fetchImageWithToken } from "../utilities/imageUtilities";

const BrightEventDetail = () => {
  const [event, setEvent] = useState<Event>();
  const [createdBy, setCreatedBy] = useState<MongoDbUser>();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [rejectEventOpen, setRejectEventOpen] = useState<boolean>(false);
  const [cancelAttendanceOpen, setCancelAttendanceOpen] =
    useState<boolean>(false);
  const [cancelRejectEventOpen, setCancelRejectEventOpen] =
    useState<boolean>(false);
  const [deleteEventOpen, setDeleteEventOpen] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [downloadOpen, setDownloadOpen] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/events/detail/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setEvent(undefined);
          throw new Error("Failed to fetch event data");
        }

        const data = await response.json();
        setEvent(data.event);

        const userResponse = await fetch(
          `${server}/api/users/${data.event?.createdBy}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        if (!userResponse.ok) {
          setCreatedBy(undefined);
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        userData.user.picture = await fetchImageWithToken(
          userData.user._id,
          token,
        );
        setCreatedBy(userData.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setDataLoaded(true);
        }, 200);
      }
    };

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, server]);

  useEffect(() => {
    if (isAuthenticated && dataLoaded && (!event || !createdBy)) {
      navigate("/not-found");
    }
  }, [isAuthenticated, dataLoaded, event, createdBy, navigate]);

  if (!user && isAuthenticated)
    return <FullscreenLoader content="Loading user..." />;

  if (!user) {
    return <Unauthorized />;
  }

  if (!event || !createdBy) {
    return;
  }
  const handleDownloadCSV: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (!event.attendances.length) {
      setDownloadOpen(true);
      return;
    }

    try {
      const token = await getAccessToken();
      const response = await fetch(
        `${server}/api/events/${event._id}/download/${user._id}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }

      const data = await response.json();

      let csvContent = "Participants:\n";

      csvContent += "Naam;";
      csvContent += event.form.map((q) => q.question).join(";");
      csvContent += "\n";
      data.participants.forEach((attendee: Attendance) => {
        csvContent += `${attendee.userName};`;
        csvContent += attendee.answers.map((answer) => answer).join(";");
        csvContent += "\n";
      });
      csvContent += "\nDenied users:\n";
      data.declined.forEach((userName: string) => {
        csvContent += `${userName}\n`;
      });

      csvContent += "\nNot answered users:\n";
      data.notAnswered.forEach((userName: string) => {
        csvContent += `${userName}\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      saveAs(blob, `${event.title}_aanwezigen.csv`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startDate = new Date(event.startDate);
  const endDate = event.endDate && new Date(event.endDate);

  return (
    <>
      <AuthenticatedTemplate>
        <div id="brightEventDetail-container">
          {!dataLoaded && <FullscreenLoader content="Gathering data..." />}
          {formOpen && (
            <FormModal
              onClose={setFormOpen}
              event={event}
              form={event.form}
              setEvent={setEvent}
            />
          )}
          {cancelAttendanceOpen && (
            <CancelAttendanceModal
              onClose={setCancelAttendanceOpen}
              event={event}
              setEvent={setEvent}
            />
          )}
          {rejectEventOpen && (
            <RejectEventModal
              onClose={setRejectEventOpen}
              event={event}
              setEvent={setEvent}
            />
          )}
          {cancelRejectEventOpen && (
            <CancelRejectEventModal
              onClose={setCancelRejectEventOpen}
              event={event}
              setEvent={setEvent}
            />
          )}
          {reportOpen && (
            <ReportModal
              onClose={setReportOpen}
              targetId={event._id}
              targetType="event"
            />
          )}
          {deleteEventOpen && (
            <DeleteEventModal
              onClose={setDeleteEventOpen}
              event={event}
              setEvent={setEvent}
            />
          )}
          {downloadOpen && <DownloadModal onClose={setDownloadOpen} />}
          <div id="brightEventDetail-top-buttons-container">
            <LinkBack href={location?.state?.linkBack || "/brightevents"} />
            <div id="brightEventDetail-top-right">
              {event.validated &&
                (event.createdBy === user._id ||
                  event.attendances.includes(user._id) ||
                  user.role === "admin") && (
                  <button
                    className="brightEventDetail-top-buttons"
                    onClick={handleDownloadCSV}
                  >
                    <IoDownloadOutline />
                    Download Attendance
                  </button>
                )}
              {(event.createdBy === user._id || user.role === "admin") && (
                <button
                  className="brightEventDetail-top-buttons"
                  onClick={() =>
                    navigate(`/brightevents/requests/update/${event._id}`)
                  }
                >
                  <MdOutlineEdit /> Edit
                </button>
              )}
              {event.validated && event.createdBy === user._id && (
                <button
                  className="brightEventDetail-top-buttons"
                  onClick={() => setDeleteEventOpen(true)}
                >
                  <RiDeleteBinLine />
                  Delete
                </button>
              )}
            </div>
          </div>
          <div id="brightEventDetail-content">
            {event.validated && <ShareButton id="share-button-container" />}
            {event.validated && (
              <button id="report-button" onClick={() => setReportOpen(true)}>
                Report
              </button>
            )}
            <div id="brightEventDetail-content-top">
              <span>{event.emoji}</span>
              <div>
                <p>
                  <CiCalendar />
                  {startDate.toLocaleDateString("nl-NL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {endDate && (
                  <>
                    <p>
                      <CiCalendar />
                      {endDate.toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                )}
                <p style={{ textTransform: "capitalize" }}>
                  <CiLocationOn />
                  {event.address}
                </p>
                {event.validated && (
                  <p>
                    <GoPeople />
                    {event.attendances.length}{" "}
                    {event.attendances.length !== 1 ? "attendees" : "attendee"}
                  </p>
                )}
              </div>
            </div>
            <h1>{event.title}</h1>
            <p id="brightEventDetail-content-description">
              {event.description}
            </p>
            <div id="brightEventDetail-content-bottom">
              <div id="brightEventDetail-deny-join">
                {event.validated &&
                  (event.attendances.includes(user._id) ? (
                    <button
                      className="brightEventDetail-bottom-buttons"
                      onClick={() => setCancelAttendanceOpen(true)}
                    >
                      Cancel participation <RxCross1 />
                    </button>
                  ) : event.declinedUsers.includes(user._id) ? (
                    <button
                      className="brightEventDetail-bottom-buttons"
                      onClick={() => setCancelRejectEventOpen(true)}
                    >
                      Undo Decline <PiArrowRightThin />
                    </button>
                  ) : (
                    <>
                      <button
                        className="brightEventDetail-bottom-buttons"
                        onClick={() => setFormOpen(true)}
                      >
                        Participate <PiArrowRightThin />
                      </button>
                      <button
                        className="brightEventDetail-bottom-buttons"
                        onClick={() => setRejectEventOpen(true)}
                      >
                        Decline <PiArrowRightThin />
                      </button>
                    </>
                  ))}
              </div>
              <div id="brightEventDetail-createdBy">
                <p>Event created by: {createdBy.name}</p>
                <img
                  src={
                    createdBy.picture === "not-found"
                      ? profile
                      : createdBy.picture
                  }
                  alt="createdby-picture"
                />
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default BrightEventDetail;
