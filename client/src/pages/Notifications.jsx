import React, { useState } from "react";
import { Dropdown, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsBell, BsCheckCircle, BsExclamationTriangle, BsInfoCircle, BsXCircle } from "react-icons/bs";
import "../styles/Notifications.css"; 

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have been assigned to the 'Community Cleanup' event!", type: "success" },
    { id: 2, message: "Update: 'Beach Cleanup' event time has changed to 10:00 AM.", type: "info" },
    { id: 3, message: "Reminder: 'Tutoring Program' event starts tomorrow at 2:00 PM.", type: "warning" },
    { id: 4, message: "New event added: 'Food Bank Assistance' - Sign up now!", type: "success" }
  ]);

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <BsCheckCircle className="text-success me-2" />;
      case "info":
        return <BsInfoCircle className="text-info me-2" />;
      case "warning":
        return <BsExclamationTriangle className="text-warning me-2" />;
      case "danger":
        return <BsXCircle className="text-danger me-2" />;
      default:
        return null;
    }
  };

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
            <Dropdown.Item key={notification.id} className="d-flex align-items-center">
              {getIcon(notification.type)}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-${notification.id}`}>{notification.message}</Tooltip>}
              >
                <span className="flex-grow-1 notification-message">{notification.message}</span>
              </OverlayTrigger>
              <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => handleDismiss(notification.id)}>
                &times;
              </button>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item className="text-muted text-center">No new notifications</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notifications;
