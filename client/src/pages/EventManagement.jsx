import React, { useState, useEffect } from "react";
import "../styles/EventManagement.css";

const EventManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    skills: [],
    urgency: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState([]);

  const skillsOptions = ["Communication", "Leadership", "Technical", "Teamwork"];
  const urgencyLevels = ["low", "medium", "high"];

  // Fetch existing events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/events");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prevData) => ({ ...prevData, skills: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      requiredSkills: formData.skills,
      urgency: formData.urgency,
      date: formData.date,
      status: "upcoming",
    };

    try {
      const response = await fetch("http://localhost:5001/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      alert("Event created successfully!");
      // Refresh the events list after creation
      fetchEvents();
      setFormData({
        name: "",
        description: "",
        location: "",
        skills: [],
        urgency: "",
        date: "",
      });
    } catch (error) {
      alert("Error creating event. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container event-management-container text-center py-5">
      <h1 className="text-danger">Event Management</h1>
      <form className="event-form mx-auto p-4 shadow rounded" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Event Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            maxLength="100"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Event Description:</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Location:</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Required Skills:</label>
          <select
            name="skills"
            className="form-select"
            multiple
            value={formData.skills}
            onChange={handleSkillsChange}
            required
          >
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Urgency:</label>
          <select
            name="urgency"
            className="form-select"
            value={formData.urgency}
            onChange={handleChange}
            required
          >
            <option value="">Select Urgency</option>
            {urgencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Event Date:</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
      <div className="mt-5">
        <h2>Manage Existing Events</h2>
        {events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <ul className="list-group">
            {events.map((event) => (
              <li key={event._id} className="list-group-item">
                <div>
                  <strong>{event.name}</strong> -{" "}
                  {new Date(event.date).toLocaleDateString()} - {event.location}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
