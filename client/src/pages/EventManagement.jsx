import React, { useState } from "react";
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

  const skillsOptions = [
    "Communication",
    "Leadership",
    "Technical",
    "Teamwork",
  ];
  const urgencyLevels = ["low", "medium", "high"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevData) => ({ ...prevData, skills: selectedOptions }));
    console.log(selectedOptions); // Log the selected skills array to the console
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      requiredSkills: formData.skills, // should be an actual array
      urgency: formData.urgency,
      date: formData.date,
      status: "upcoming",
    };

    console.log("Payload being sent:", payload); // Log the payload

    try {
      const response = await fetch("http://localhost:5001/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      alert("Event created successfully!");
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
      <form
        className="event-form mx-auto p-4 shadow rounded"
        onSubmit={handleSubmit}
      >
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

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventManagement;
