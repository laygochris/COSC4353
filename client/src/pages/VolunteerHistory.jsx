import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/VolunteerHistory.css";

const VolunteerHistory = () => {
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const userId = localStorage.getItem("userId"); // Get userId from localStorage

      if (!token || !userId) {
        throw new Error("User not authenticated");
      }
      
      try {

        console.log("Attempting to find volunteer history for user:", userId);

        // Make the API call using userId from localStorage
        const response = await fetch(
          `http://localhost:5001/api/volunteer-history/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token as Authorization header
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch volunteer history");

        const data = await response.json();
        console.log("Fetched volunteer history:", data);

        setVolunteerEvents(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching volunteer history:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchVolunteerHistory(); // Call the function to fetch the volunteer history
  }, []); // Empty dependency array to run once when the component mounts

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
                    <td>{event.name}</td>
                    <td>{event.description}</td>
                    <td>{event.location}</td>
                    <td>
                      {event.required_skills &&
                      event.required_skills.length > 0 ? (
                        event.required_skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="badge bg-secondary me-1"
                          >
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
                            event.urgency === "High"
                              ? "#931621"
                              : event.urgency === "Medium"
                              ? "#D9A404"
                              : "#60993E",
                          color: "white",
                        }}
                      >
                        {event.urgency}
                      </span>
                    </td>
                    <td>{event.date}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            event.status === "Completed"
                              ? "#60993E"
                              : event.status === "Upcoming"
                              ? "#2C365E"
                              : "#931621",
                          color: "white",
                        }}
                      >
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No volunteer history found.
                  </td>
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
