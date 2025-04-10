const PDFDocument = require("pdfkit");
const Event = require("../models/events");
const User = require("../models/users");

exports.generateCombinedReport = async (req, res) => {
  try {
    
    const events = await Event.find().populate("assignedVolunteers", "fullName email");
    const volunteers = await User.find();

    // Prepare data for the report
    const reportData = {
      volunteers: volunteers.map((vol) => ({
        
        name: vol.fullName || "N/A",
        email: vol.email || "N/A",
        participationHistory: events
          .filter((event) => 
            event.assignedVolunteers.some((v) => v._id.equals(vol._id))
          )
          .map((event) => event.name),
      })),
      events: events.map((event) => ({
        name: event.name,
        description: event.description,
        location: event.location,
        date: event.date,
        
        assignedVolunteers: event.assignedVolunteers.map(
          (vol) => vol.fullName || "N/A"
        ),
      })),
    };

    // output format
    const format = req.query.format ? req.query.format.toLowerCase() : "pdf";

    if (format === "csv") {
      // CSV content
      let csvContent = "Volunteers and Participation History\n";
      csvContent += "Name,Email,Participation History\n";
      reportData.volunteers.forEach((vol) => {
        csvContent += `"${vol.name}","${vol.email}","${vol.participationHistory.join(", ")}"\n`;
      });

      csvContent += "\nEvent Details and Volunteer Assignments\n";
      csvContent += "Event Name,Description,Location,Date,Assigned Volunteers\n";
      reportData.events.forEach((event) => {
        csvContent += `"${event.name}","${event.description}","${event.location}","${event.date}","${event.assignedVolunteers.join(", ")}"\n`;
      });

      res.setHeader("Content-disposition", "attachment; filename=combined_report.csv");
      res.set("Content-Type", "text/csv");
      return res.send(csvContent);
    } else {
      // PDF report
      const doc = new PDFDocument();
      res.setHeader("Content-disposition", "attachment; filename=combined_report.pdf");
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);

      doc.fontSize(16).text("Combined Report", { align: "center" });
      doc.moveDown();

      // volunteer section
      doc.fontSize(14).text("Volunteers and Participation History");
      reportData.volunteers.forEach((vol) => {
        doc.fontSize(12).text(`Name: ${vol.name}`);
        doc.text(`Email: ${vol.email}`);
        doc.text(`Participation History: ${vol.participationHistory.join(", ") || "None"}`);
        doc.moveDown();
      });

      // event section
      doc.addPage();
      doc.fontSize(14).text("Event Details and Volunteer Assignments");
      reportData.events.forEach((event) => {
        doc.fontSize(12).text(`Event Name: ${event.name}`);
        doc.text(`Description: ${event.description}`);
        doc.text(`Location: ${event.location}`);
        doc.text(`Date: ${event.date}`);
        doc.text(`Assigned Volunteers: ${event.assignedVolunteers.join(", ") || "None"}`);
        doc.moveDown();
      });

      doc.end();
    }
  } catch (error) {
    console.error("Error generating combined report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
