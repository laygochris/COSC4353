import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/VolunteerHistory.css"; 

const VolunteerHistory = () => {
  const [volunteerData, setVolunteerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          eventName: "Community Cleanup",
          eventDescription: "Join us in cleaning up the coastline to protect marine life.",
          location: "Galveston, TX",
          requiredSkills: ["Teamwork", "Leadership"],
          urgency: "High",
          eventDate: "08/16/24",
          status: "Completed",
        },
        {
          id: 2,
          eventName: "Food Bank Assistance",
          eventDescription: "Help distribute food to families in need.",
          location: "Houston, Texas",
          requiredSkills: ["Communication", "Organization"],
          urgency: "Medium",
          eventDate: "07/20/24",
          status: "Upcoming",
        },
        {
          id: 3,
          eventName: "Tutoring Program",
          eventDescription: "Replant trees and maintain green spaces.",
          location: "Pearland, TX",
          requiredSkills: ["Communication"],
          urgency: "High",
          eventDate: "10/28/24",
          status: "Completed",
        },
        {
          id: 4,
          eventName: "Animal Shelter Help",
          eventDescription: "Assist in caring for rescued animals.",
          location: "Sugar Land, TX",
          requiredSkills: ["Animal Care"],
          urgency: "Low",
          eventDate: "12/05/24",
          status: "Canceled",
        },
      ];
      setVolunteerData(data);
    };

    fetchData();
  }, []);

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
            {volunteerData.length > 0 ? (
              volunteerData.map((event, index) => (
                <tr key={event.id}>
                  <td>{index + 1}</td>
                  <td>{event.eventName}</td>
                  <td>{event.eventDescription}</td>
                  <td>{event.location}</td>
                  <td>
                    {Array.isArray(event.requiredSkills) && event.requiredSkills.length > 0 ? (
                      event.requiredSkills.map((skill, skillIndex) => (
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
                      className={`badge ${
                        event.urgency === "High"
                          ? "bg-danger"
                          : event.urgency === "Medium"
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    >
                      {event.urgency}
                    </span>
                  </td>
                  <td>{event.eventDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        event.status === "Completed"
                          ? "bg-success"
                          : event.status === "Upcoming"
                          ? "bg-primary"
                          : event.status === "Canceled"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
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
      </div>
    </div>
  );
};

export default VolunteerHistory;
