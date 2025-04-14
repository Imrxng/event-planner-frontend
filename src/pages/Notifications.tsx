import React from 'react';
import '../styles/Notifications.component.css';
import LinkBack from '../components/LinkBack';
import {VscGraph,VscError,VscPass} from "react-icons/vsc";
interface Notification {
    type: string;
    message: string;
    time:Date;
}

const Notifications: React.FC = () => {
    const notifications: Notification[] = [
        { message: 'You have a new event invitation.', type: "news", time: new Date('2023-03-01T10:00:00') },
        { message: 'Your event has been updated.', type: "cancel", time: new Date('2023-03-02T14:30:00') },
        { message: 'Reminder: Event tomorrow at 10 AM.', type: "confirm", time: new Date('2023-03-03T09:00:00') },
    ];

    return (
        <div id="notifications-container">
            <LinkBack href="/" />
            <h1 className="notifications-title">Notifications</h1>
            <ul className="notifications-list">
                {notifications.map((notification:Notification,id) => (
                    <li key={id} className="notification-item">
                        <div className="notification-left">
                        {notification.type === "news" && <VscGraph className='news-icon'/>}
                        {notification.type === "cancel" && <VscError className='cancel-icon'/>}
                        {notification.type === "confirm" && <VscPass className='confirm-icon'/>}
                        <div className="notification-text">
                        <p className="notification-message">{notification.message}</p>
                        <small className="notification-time">{notification.time.getTime()}</small>
                        </div>
                        </div>
                        <button className="notification-button">View</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;