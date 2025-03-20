import React, { useState } from "react";
import "../styles/EventManagement.css";

const EventManagement = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    requiredSkills: [],
    urgency: "",
    eventDate: "",
  });

  const skillsOptions = ["Communication", "Leadership", "Technical", "Teamwork"];
  const urgencyLevels = ["low", "medium", "high"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prevData) => ({ ...prevData, requiredSkills: selectedOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="container event-management-container text-center py-5">
      <h1 className="text-danger">Event Management</h1>
      <form className="event-form mx-auto p-4 shadow rounded" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Event Name:</label>
          <input
            type="text"
            name="eventName"
            className="form-control"
            value={formData.eventName}
            onChange={handleChange}
            maxLength="100"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Event Description:</label>
          <textarea
            name="eventDescription"
            className="form-control"
            value={formData.eventDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Location:</label>
          <textarea
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
            name="requiredSkills"
            className="form-select"
            multiple
            value={formData.requiredSkills}
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
            name="eventDate"
            className="form-control"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Create Event</button>
      </form>
    </div>
  );
};

export default EventManagement;
