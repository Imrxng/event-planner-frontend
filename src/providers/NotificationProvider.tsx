import React, { useContext, useEffect, useMemo, useState } from 'react'
import { NotificationContext, UserContext } from '../context/context';
import useAccessToken from '../utilities/getAccesToken';
import { Notification } from '../types/types';

interface Props {
    children: React.ReactNode;
};

const NotificationProvider = ({ children }: Props) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useContext(UserContext);
    const server = import.meta.env.VITE_SERVER_URL;
    const { getAccessToken } = useAccessToken();

    useEffect(() => {
        if (!user) return;
        const fetchNotifications = async () => {
            try {
                const token = await getAccessToken();
                const response = await fetch(`${server}/api/users/notifications/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }

                const data = await response.json();
                setNotifications(data.notifications);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        const interval = setInterval(() => {
            fetchNotifications(); 
        }, 5000);
    
        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [server, user]);


    const contextValue = useMemo(() => ({ notifications }), [notifications]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}

export default NotificationProvider;