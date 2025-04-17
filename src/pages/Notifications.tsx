import React, { JSX, useContext } from 'react';
import '../styles/Notifications.component.css';
import LinkBack from '../components/LinkBack';
import {
  VscTrash,
  VscWarning,
  VscChromeClose,
  VscCheck,
  VscBell
} from 'react-icons/vsc';
import { NotificationContext } from '../context/context';
import { Notification } from '../types/types';

type NotificationType =
  | 'event_deleted'
  | 'attendance_removed'
  | 'event_declined'
  | 'event_undeclined'
  | 'event_upcoming';


const typeToIcon: Record<NotificationType, JSX.Element> = {
  event_deleted: <VscTrash className="icon deleted-icon" />,
  attendance_removed: <VscWarning className="icon removed-icon" />,
  event_declined: <VscChromeClose className="icon declined-icon" />,
  event_undeclined: <VscCheck className="icon undeclined-icon" />,
  event_upcoming: <VscBell className="icon upcoming-icon" />,
};

const getIcon = (type: string): JSX.Element => {
  if (type in typeToIcon) {
    return typeToIcon[type as NotificationType];
  }
  return <VscBell className="icon default-icon" />;
};

const Notifications: React.FC = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <div id="notifications-container">
      <LinkBack href="/" />
      <h1 className="notifications-title">Notifications</h1>
      <ul className="notifications-list">
        {notifications.map((notification: Notification, id: number) => (
          <li key={id} className="notification-item">
            <div className="notification-left">
              {getIcon(notification.type)}
              <div className="notification-text">
                <p className="notification-message">{notification.message}</p>
                <small className="notification-time">
                  {new Date(notification.createdAt).toLocaleString('nl-NL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Brussels'
                  })}
                </small>
              </div>
            </div>
            <button className="notification-button">Mark as read</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
