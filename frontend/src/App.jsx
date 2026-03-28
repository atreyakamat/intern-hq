import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import DashboardPage from './pages/DashboardPage';
import ApplicantDetail from './components/Applicants/ApplicantDetail';
import ResumeUpload from './components/Upload/ResumeUpload';
import RoleSetupPage from './pages/RoleSetupPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ApplicantsPage from './pages/ApplicantsPage';
import DashboardOverview from './pages/DashboardOverview';
import CreateRolePage from './pages/CreateRolePage';

const AppLayout = () => (
  <div className="flex flex-col min-h-screen bg-slate-50">
    <Navbar />
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const CandidateRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/applicants/${id}`} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/overview" element={<DashboardOverview />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/applicants/:id" element={<ApplicantDetail />} />
          <Route path="/candidates/:id" element={<CandidateRedirect />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/roles" element={<RoleSetupPage mode="list" />} />
          <Route path="/roles/new" element={<CreateRolePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
