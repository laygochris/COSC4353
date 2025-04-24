import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Card } from "react-bootstrap";

const VolunteerHistory = () => {
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      try {
        const response = await fetch(`http://localhost:5001/api/volunteer-history/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch volunteer history");

        const data = await response.json();
        setVolunteerEvents(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerHistory();
  }, []);

  const getUrgencyColor = (urgency) => {
    switch ((urgency || "").toLowerCase()) {
      case "high":
        return "#931621";
      case "medium":
        return "#D9A404";
      case "low":
        return "#60993E";
      default:
        return "#4b0e0e";
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "upcoming":
        return "#2c365e";
      case "completed":
        return "#60993E";
      default:
        return "#931621";
    }
  };

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const renderEvents = (events) =>
    events.map((event, index) => (
      <div className="col-md-6" key={index}>
        <Card className="shadow-sm h-100 border-0" style={{ backgroundColor: "#f8f9fa" }}>
          <Card.Body>
            <Card.Title className="mb-2 fw-semibold">{event.name}</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">{event.location}</Card.Subtitle>
            <Card.Text className="mb-3">{event.description}</Card.Text>

            <div className="mb-2">
              <strong>Skills:</strong>{" "}
              {event.requiredSkills && event.requiredSkills.length > 0 ? (
                event.requiredSkills.map((skill, i) => (
                  <span key={i} className="badge bg-secondary me-1">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="badge bg-secondary">N/A</span>
              )}
            </div>

            <div className="mb-2">
              <strong>Urgency:</strong>{" "}
              <span
                className="badge"
                style={{
                  backgroundColor: getUrgencyColor(event.urgency),
                  color: "white",
                  padding: "0.35em 0.65em",
                  fontSize: "0.75em",
                  borderRadius: "0.25rem",
                }}
              >
                {capitalize(event.urgency)}
              </span>
            </div>

            <div className="mb-2">
              <strong>Date:</strong>{" "}
              {new Date(event.date).toISOString().slice(0, 10)}
            </div>

            <div>
              <strong>Status:</strong>{" "}
              <span
                className="badge"
                style={{
                  backgroundColor: getStatusColor(event.status),
                  color: "white",
                  padding: "0.35em 0.65em",
                  fontSize: "0.75em",
                  borderRadius: "0.25rem",
                }}
              >
                {capitalize(event.status)}
              </span>
            </div>
          </Card.Body>
        </Card>
      </div>
    ));

  const upcomingEvents = volunteerEvents.filter(event => event.status === "upcoming");
  const pastEvents = volunteerEvents.filter(event => event.status !== "upcoming");

  return (
    <div className="container py-5">

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Fetching your records...</p>
        </div>
      ) : volunteerEvents.length === 0 ? (
        <p className="text-center">No volunteer history found.</p>
      ) : (
        <>
          {upcomingEvents.length > 0 && (
            <>
              <h2 className="mb-3">Upcoming Events</h2>
              <div className="row g-4 mb-5">
                {renderEvents(upcomingEvents)}
              </div>
            </>
          )}

          {pastEvents.length > 0 && (
            <>
              <h2 className="mb-3">Event History</h2>
              <div className="row g-4">
                {renderEvents(pastEvents)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VolunteerHistory;
