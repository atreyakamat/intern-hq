import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateDashboard from './src/components/Dashboard/CandidateDashboard';
import CandidateDetail from './src/components/Candidates/CandidateDetail';
// Import your existing components
import Navbar from './src/components/Navbar'; // Your existing navbar
import Footer from './src/components/Footer'; // Your existing footer
import Login from './src/components/Auth/Login'; // Your existing login
import Register from './src/components/Auth/Register'; // Your existing register
// Other imports...

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Use the new dashboard as your main route */}
            <Route path="/" element={<CandidateDashboard />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            
            {/* Keep your existing routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Other routes... */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
