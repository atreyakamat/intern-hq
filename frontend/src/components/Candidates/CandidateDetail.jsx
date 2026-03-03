import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/candidates/${id}`);
      setCandidate(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidate:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/candidates/${id}`, { status: newStatus });
      fetchCandidate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading candidate details...</div>;
  if (!candidate) return <div style={{ padding: "2rem", textAlign: "center" }}>Candidate not found</div>;

  const c = candidate;

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto", background: "white", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem", background: "none", border: "none", color: "#3498db", cursor: "pointer" }}>
        &larr; Back to Dashboard
      </button>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h1>{c.name}</h1>
        <div style={{ 
          padding: "10px 20px", 
          borderRadius: "50%", 
          background: c.aiScore >= 80 ? "#27ae60" : c.aiScore >= 60 ? "#f39c12" : "#e74c3c",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.5rem"
        }}>
          {c.aiScore}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <p><b>Email:</b> {c.email}</p>
        <p><b>Education:</b> {c.education}</p>
        <p><b>Experience:</b> {c.yearsOfExperience} years</p>
        <p><b>Status:</b> <span style={{ textTransform: "capitalize", padding: "4px 12px", borderRadius: 20, background: "#f0f0f0", fontSize: "0.9rem" }}>{c.status}</span></p>
        {c.role && <p><b>Applying for:</b> {c.role.title}</p>}
      </div>
      
      <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "2rem 0" }} />
      
      <h3>Skills</h3>
      <div style={{ marginBottom: "2rem" }}>
        {c.skills && c.skills.map(skill => (
          <span key={skill} style={{
            marginRight: 8,
            marginBottom: 8,
            padding: "6px 12px",
            background: "#edf2f7",
            color: "#2d3748",
            borderRadius: 6,
            display: "inline-block",
            fontSize: "0.9rem"
          }}>{skill}</span>
        ))}
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <h3 style={{ color: "#27ae60" }}>Strengths</h3>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {c.strengths && c.strengths.map((s, idx) => <li key={idx} style={{ marginBottom: 8 }}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h3 style={{ color: "#e74c3c" }}>Weaknesses</h3>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {c.weaknesses && c.weaknesses.map((w, idx) => <li key={idx} style={{ marginBottom: 8 }}>{w}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: 8, borderLeft: "4px solid #3498db", marginBottom: "2rem" }}>
        <h3>AI Fit Analysis</h3>
        <p style={{ lineHeight: "1.6", color: "#4a5568" }}>{c.aiSummary}</p>
        <p><b>Overall Rating:</b> <span style={{ fontWeight: "bold", color: "#2d3748" }}>{c.fitRating}</span></p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
        <button 
          onClick={() => handleStatusChange('shortlisted')}
          style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: "#27ae60", color: "white", fontWeight: "bold", cursor: "pointer", flex: 1 }}
        >
          Shortlist
        </button>
        <button 
          onClick={() => handleStatusChange('rejected')}
          style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: "#e74c3c", color: "white", fontWeight: "bold", cursor: "pointer", flex: 1 }}
        >
          Reject
        </button>
        <button 
          style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #cbd5e0", background: "white", color: "#4a5568", fontWeight: "bold", cursor: "pointer", flex: 1 }}
        >
          Contact
        </button>
      </div>
    </div>
  );
}

export default CandidateDetail;