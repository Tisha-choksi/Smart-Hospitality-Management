import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import '../styles/notifications.css';

function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Connect to WebSocket
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to notifications');
            if (user) {
                newSocket.emit('join', user.id);
            }
        });

        newSocket.on('notification', (data) => {
            addNotification(data);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 10));
        setUnreadCount(prev => prev + 1);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.timestamp !== notification.timestamp));
        }, 5000);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <div className="notifications-container">
            <div className="notification-bell">
                <button onClick={() => setNotifications([])} className="bell-icon">
                    🔔
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </button>
            </div>

            {notifications.length > 0 && (
                <div className="notification-panel">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <button onClick={clearNotifications} className="clear-btn">Clear</button>
                    </div>

                    <div className="notification-list">
                        {notifications.map((notif, idx) => (
                            <div key={idx} className={`notification-item ${notif.type.toLowerCase()}`}>
                                <div className="notification-icon">
                                    {notif.type === 'REQUEST_UPDATED' && '📋'}
                                    {notif.type === 'BOOKING_CONFIRMED' && '✅'}
                                    {notif.type === 'PAYMENT_RECEIVED' && '💰'}
                                </div>
                                <div className="notification-content">
                                    <h4>{notif.title}</h4>
                                    <p>{notif.message}</p>
                                    <span className="time">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notifications;