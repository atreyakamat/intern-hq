import React from "react";

const mockCandidate = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1-555-123-4567",
  location: "New York, USA",
  education: [
    { degree: "B.Sc. Computer Science", institution: "NYU", year: "2023" }
  ],
  experience: [
    {
      company: "TechCorp",
      title: "Intern",
      years: "2022-2023",
      desc: "Worked on frontend React apps"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "MongoDB"],
  aiScore: 82,
  aiSummary: "Strong candidate with excellent frontend skills and internship experience.",
  status: "Shortlisted"
};

function CandidateDetail() {
  const c = mockCandidate; // Replace this with actual data from API later

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h1>{c.name}</h1>
      <div>
        <b>Email:</b> {c.email}<br />
        <b>Phone:</b> {c.phone}<br />
        <b>Location:</b> {c.location}<br />
        <b>Status:</b> {c.status}<br />
      </div>
      <hr />
      <h3>Education</h3>
      <ul>
        {c.education.map((edu, idx) => (
          <li key={idx}>
            {edu.degree}, {edu.institution} ({edu.year})
          </li>
        ))}
      </ul>
      <h3>Experience</h3>
      <ul>
        {c.experience.map((exp, idx) => (
          <li key={idx}>
            {exp.title} at {exp.company} ({exp.years})<br />
            <small>{exp.desc}</small>
          </li>
        ))}
      </ul>
      <h3>Skills</h3>
      <div>
        {c.skills.map(skill => (
          <span key={skill} style={{
            marginRight: 8,
            padding: "4px 8px",
            background: "#eee",
            borderRadius: 4,
            display: "inline-block"
          }}>{skill}</span>
        ))}
      </div>
      <hr />
      <h3>AI Insights</h3>
      <div>
        <b>AI Score:</b> {c.aiScore}<br />
        <b>Summary:</b> {c.aiSummary}
      </div>
      <div style={{ marginTop: 24 }}>
        <button style={{ marginRight: 8 }}>Shortlist</button>
        <button style={{ marginRight: 8 }}>Reject</button>
        <button>Contact</button>
      </div>
    </div>
  );
}

export default CandidateDetail;