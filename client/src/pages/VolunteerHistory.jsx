import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/VolunteerHistory.css";

const VolunteerHistory = ({ volunteerId: propVolunteerId, userEmail }) => {
  const { volunteerId: paramVolunteerId } = useParams(); 
  const [volunteerId, setVolunteerId] = useState(propVolunteerId || paramVolunteerId);
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch volunteerId from VolunteerController if not available
  useEffect(() => {
    if (!volunteerId && userEmail) {
      const fetchVolunteerId = async () => {
        try {
          console.log(`Fetching volunteer ID for email: ${userEmail}`);
          const response = await fetch(`http://localhost:5001/api/volunteers/me?email=${userEmail}`);
          if (!response.ok) throw new Error("Failed to fetch volunteer ID");

          const data = await response.json();
          console.log("Volunteer Data:", data);

          if (data.volunteerId) {
            setVolunteerId(data.volunteerId);
          } else {
            console.error("volunteerId is missing from API response.");
          }
        } catch (error) {
          console.error("Error fetching volunteerId:", error);
        }
      };
      fetchVolunteerId();
    }
  }, [volunteerId, userEmail]);

  // Fetch volunteer history when volunteerId is available
  useEffect(() => {
    if (!volunteerId || isNaN(volunteerId)) {
      console.error("Invalid volunteerId detected:", volunteerId);
      return;
    }

    const fetchVolunteerHistory = async () => {
      try {
        console.log(`Fetching history for volunteer ID: ${volunteerId}`);
        const response = await fetch(`http://localhost:5001/api/events/volunteer/${volunteerId}`);

        if (!response.ok) throw new Error("Failed to fetch volunteer history");

        const data = await response.json();
        console.log("Fetched data:", data);
        setVolunteerEvents(data);
      } catch (error) {
        console.error("Error fetching volunteer history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerHistory();
  }, [volunteerId]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Volunteer History</h1>
      <div className="table-responsive">
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
                    <span className="badge"
                      style={{
                        backgroundColor:
                          event.urgency === "High" ? "#931621" :
                          event.urgency === "Medium" ? "#D9A404" : "#60993E",
                        color: "white",
                      }}>
                      {event.urgency}
                    </span>
                  </td>
                  <td>{event.date}</td>
                  <td>
                    <span className="badge"
                      style={{
                        backgroundColor:
                          event.status === "Completed" ? "#60993E" :
                          event.status === "Upcoming" ? "#2C365E" : "#931621",
                        color: "white",
                      }}>
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
      </div>
    </div>
  );
};

export default VolunteerHistory;
