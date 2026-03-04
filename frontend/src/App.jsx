import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import DashboardPage from './pages/DashboardPage';
import ApplicantDetail from './components/Applicants/ApplicantDetail';
import ResumeUpload from './components/Upload/ResumeUpload';
import RoleSetupPage from './pages/RoleSetupPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/applicants/:id" element={<ApplicantDetail />} />
            <Route path="/upload" element={<ResumeUpload />} />
            <Route path="/roles" element={<RoleSetupPage mode="list" />} />
            <Route path="/roles/new" element={<RoleSetupPage mode="create" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
