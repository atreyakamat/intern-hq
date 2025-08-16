import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateDashboard from './components/Dashboard/CandidateDashboard';
import CandidateDetail from './components/Candidates/CandidateDetail';
import Navbar from './components/Navbar'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CandidateDashboard />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
