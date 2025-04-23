import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../styles/EventManagement.css";
import { Spinner } from "react-bootstrap";

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

  const skillsOptions = [
    { label: "Communication", value: "Communication" },
    { label: "Leadership", value: "Leadership" },
    { label: "Technical", value: "Technical" },
    { label: "Teamwork", value: "Teamwork" },
  ];

  const urgencyLevels = ["low", "medium", "high"];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/events");
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData((prev) => ({ ...prev, skills: selectedOptions.map((opt) => opt.value) }));
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

      if (!response.ok) throw new Error("Failed to create event");

      alert("✅ Event created successfully!");
      fetchEvents();
      setFormData({ name: "", description: "", location: "", skills: [], urgency: "", date: "" });
    } catch (error) {
      alert("❌ Error creating event. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleDownload = async (format) => {
    try {
      const url = `http://localhost:5001/api/reports/combined?format=${format}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      window.open(url, "_blank");
    } catch (error) {
      alert("❌ Report download failed.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Event Management</h1>

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white mb-5">
        <h4 className="mb-4 text-start">➕ Create a New Event</h4>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Event Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="col-md-12">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows={3} value={formData.description} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Required Skills</label>
            <Select
              isMulti
              options={skillsOptions}
              value={skillsOptions.filter(opt => formData.skills.includes(opt.value))}
              onChange={handleSelectChange}
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Urgency</label>
            <select name="urgency" className="form-select" value={formData.urgency} onChange={handleChange} required>
              <option value="">Select urgency</option>
              {urgencyLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="btn w-100 mt-4" style={{ backgroundColor: "#60993E", borderColor: "#60993E", color: "white" }} disabled={isSubmitting}>
          {isSubmitting ? <><Spinner size="sm" animation="border" /> Creating...</> : "Create Event"}
        </button>
      </form>

      <div className="text-center">
        <h4 className="mb-3">📄 Download Combined Reports</h4>
        <button onClick={() => handleDownload("pdf")} className="btn btn-outline-primary m-2">
          Download PDF
        </button>
        <button onClick={() => handleDownload("csv")} className="btn btn-outline-secondary m-2">
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default EventManagement;
