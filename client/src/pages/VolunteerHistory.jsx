import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/VolunteerHistory.css";

const VolunteerHistory = () => {
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await fetch("http://localhost:5001/api/volunteer-history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch volunteer history");

        const data = await response.json();
        console.log("Fetched volunteer history:", data);

        setVolunteerEvents(data);
      } catch (error) {
        console.error("Error fetching volunteer history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerHistory();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Volunteer History</h1>
      <div className="table-responsive">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="table custom-table-header">
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Event Description</th>
                <th>Location</th>
                <th>Required Skills</th>
                <th>Urgency</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {volunteerEvents.length > 0 ? (
                volunteerEvents.map((event, index) => (
                  <tr key={event.id}>
                    <td>{index + 1}</td>
                    <td>{event.name || "N/A"}</td>
                    <td>{event.description || "N/A"}</td>
                    <td>{event.location || "N/A"}</td>
                    <td>
                      {event.required_skills && event.required_skills.length > 0 ? (
                        event.required_skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="badge bg-secondary me-1">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="badge bg-secondary">N/A</span>
                      )}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            event.urgency?.toLowerCase() === "high"
                              ? "#931621"
                              : event.urgency?.toLowerCase() === "medium"
                              ? "#D9A404"
                              : "#60993E",
                          color: "white",
                        }}
                      >
                        {event.urgency || "N/A"}
                      </span>
                    </td>
                    <td>{event.date ? new Date(event.date).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            event.status?.toLowerCase() === "completed"
                              ? "#60993E"
                              : event.status?.toLowerCase() === "upcoming"
                              ? "#2C365E"
                              : "#931621",
                          color: "white",
                        }}
                      >
                        {event.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No volunteer history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VolunteerHistory;
