import React, { JSX, useContext, useState } from "react";
import "../styles/Notifications.component.css";
import LinkBack from "../components/LinkBack";
import {
  VscTrash,
  VscWarning,
  VscChromeClose,
  VscCheck,
  VscBell,
  VscAdd,
  VscCheckAll,
  VscRefresh,
} from "react-icons/vsc";
import { NotificationContext, UserContext } from "../context/context";
import { Notification } from "../types/types";
import { RiDeleteBinLine } from "react-icons/ri";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import useAccessToken from "../utilities/getAccesToken";
import { useLocation } from "react-router-dom";
import Pagination from "../components/globals/Pagination";
import DeleteNotificationModal from "../modals/DeleteNotificationModal";
import DeleteAllNotificationModal from "../modals/DeleteAllNotificationModal";

type NotificationType =
  | "event_deleted"
  | "attendance_removed"
  | "event_refusal_reminder"
  | "event_declined"
  | "event_undeclined"
  | "event_upcoming"
  | "event_attending"
  | "event_created"
  | "event_approved"
  | "event_declined_succesfully"
  | "event_attendance_declined"
  | "event_attendance_undeclined"
  | "poll_updated"
  | "event_updated";

const typeToIcon: Record<NotificationType, JSX.Element> = {
  event_deleted: <VscTrash className="icon deleted-icon" />,
  attendance_removed: <VscWarning className="icon removed-icon" />,
  event_refusal_reminder: <VscWarning className="icon refusal-reminder-icon" />,
  event_declined: <VscChromeClose className="icon declined-icon" />,
  event_undeclined: <VscCheck className="icon undeclined-icon" />,
  event_upcoming: <VscBell className="icon upcoming-icon" />,
  event_attending: <VscCheckAll className="icon attending-icon" />,
  event_created: <VscAdd className="icon created-icon" />,
  event_approved: <VscCheck className="icon approved-icon" />,
  event_declined_succesfully: (
    <VscChromeClose className="icon declined-successfully-icon" />
  ),
  event_attendance_declined: (
    <VscChromeClose className="icon attendance-declined-icon" />
  ),
  event_attendance_undeclined: (
    <VscCheck className="icon attendance-undeclined-icon" />
  ),
  poll_updated: <VscRefresh className="icon updated-icon" />,
  event_updated: <VscRefresh className="icon updated-icon" />,
};

const getIcon = (type: string): JSX.Element => {
  if (type in typeToIcon) {
    return typeToIcon[type as NotificationType];
  }
  return <VscBell className="icon default-icon" />;
};

const Notifications: React.FC = () => {
  const { notifications, setNotifications, notificationLoader, firstRender } =
    useContext(NotificationContext);
  const { user } = useContext(UserContext);
  const [marking, setMarking] = useState<boolean>(false);
  const [deleteNotificationModal, setDeleteNotificationModal] = useState<
    string | null
  >(null); // Track selected notification ID
  const [deleteAllNotificationModal, setDeleteAllNotificationModal] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationPerPage = 6;
  const pagesPerGroup = 4;
  const location = useLocation();
  const { getAccessToken } = useAccessToken();
  const server = import.meta.env.VITE_SERVER_URL;

  const handleMarkAsRead = async (
    createdAt: string,
    message: string,
    type: string,
  ) => {
    try {
      if (!user) {
        return;
      }
      setMarking(true);
      const token = await getAccessToken();
      const response = await fetch(
        `${server}/api/users/notifications/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ createdAt, message, type, userId: user._id }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(
        notifications.map((noti) => {
          const isSame =
            new Date(noti.createdAt).getTime() ===
              new Date(createdAt).getTime() &&
            noti.message === message &&
            noti.type === type;
          return isSame ? { ...noti, read: true } : noti;
        }),
      );
      setMarking(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const indexOfLastEvent = currentPage * notificationPerPage;
  const indexOfFirstEvent = indexOfLastEvent - notificationPerPage;
  const currentNotifications = sortedNotifications.slice(
    indexOfFirstEvent,
    indexOfLastEvent,
  );

  return (
    <div id="notifications-container">
      {notificationLoader && firstRender ? (
        <FullscreenLoader content="Gathering data..." />
      ) : (
        <>
          <LinkBack href={location?.state?.linkBack || "/"} />
          {notifications.length === 0 ? (
            <p style={{ paddingTop: "2rem" }}>No notifications available...</p>
          ) : (
            <>
              <div id="notifications-header">
                {deleteAllNotificationModal && (
                  <DeleteAllNotificationModal
                    onClose={setDeleteAllNotificationModal}
                    setNotifications={setNotifications}
                  />
                )}
                <h1 className="notifications-title">Notifications</h1>
                <RiDeleteBinLine
                  className="delete-all-icon"
                  onClick={() => setDeleteAllNotificationModal(true)}
                />
              </div>
              <ul className="notifications-list">
                {currentNotifications.map(
                  (notification: Notification, id: number) => (
                    <li
                      key={id}
                      className={`notification-item ${notification.read ? "read" : "unread"}`}
                    >
                      <div className="notification-left">
                        {getIcon(notification.type)}
                        <div className="notification-text">
                          <p className="notification-message">
                            {notification.message}
                          </p>
                          <small className="notification-time">
                            {new Date(notification.createdAt).toLocaleString(
                              "nl-NL",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "Europe/Brussels",
                              },
                            )}
                          </small>
                        </div>
                      </div>
                      <div id="mark-read-delete-notification">
                        {!notification.read && (
                          <button
                            className="notification-button"
                            onClick={() =>
                              handleMarkAsRead(
                                notification.createdAt,
                                notification.message,
                                notification.type,
                              )
                            }
                            disabled={marking}
                          >
                            Mark as read
                          </button>
                        )}
                        <RiDeleteBinLine
                          className="notification-delete-icon"
                          onClick={() =>
                            setDeleteNotificationModal(notification.createdAt)
                          } // Open modal for the specific notification
                        />
                        {deleteNotificationModal === notification.createdAt && (
                          <DeleteNotificationModal
                            onClose={() => setDeleteNotificationModal(null)} // Close the modal after deletion
                            notification={notification}
                            setNotifications={setNotifications}
                            notifications={notifications}
                          />
                        )}
                      </div>
                    </li>
                  ),
                )}
              </ul>
              <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                itemsList={sortedNotifications}
                pagesPerGroup={pagesPerGroup}
                itemsPerPage={notificationPerPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
