import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Dropdown, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsBell, BsCheckCircle, BsExclamationTriangle, BsInfoCircle, BsXCircle } from "react-icons/bs";
import "../styles/Notifications.css"; 

const NotificationItem = ({ notification, onDismiss }) => {
  const getIcon = (type) => {
    const icons = {
      success: <BsCheckCircle className="text-success me-2" />,
      info: <BsInfoCircle className="text-info me-2" />,
      warning: <BsExclamationTriangle className="text-warning me-2" />,
      danger: <BsXCircle className="text-danger me-2" />,
    };
    return icons[type] || null;
  };

  return (
    <Dropdown.Item className="d-flex align-items-center">
      {getIcon(notification.type)}
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${notification.id}`}>{notification.message}</Tooltip>}
      >
        <span className="flex-grow-1 notification-message">{notification.message}</span>
      </OverlayTrigger>
      <button
        className="btn btn-sm btn-outline-danger ms-2"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(notification.id)}
      >
        &times;
      </button>
    </Dropdown.Item>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle dismiss notification
  const handleDismiss = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      setNotifications((prev) => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error("Error dismissing notification", error);
    }
  }, []);

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" className="position-relative">
        <BsBell size={24} />
        {notifications.length > 0 && (
          <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-circle">
            {notifications.length}
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ width: "350px", maxHeight: "300px", overflowY: "auto" }}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onDismiss={handleDismiss} />
          ))
        ) : (
          <Dropdown.Item className="text-muted text-center">No new notifications</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notifications;
