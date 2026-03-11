import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/admin/Jobs';
import Kanban from './pages/admin/Kanban';
import CandidateDetail from './pages/admin/CandidateDetail';
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerCandidates from './pages/partner/Candidates';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId/kanban" element={<Kanban />} />
          <Route path="/candidates" element={<div className="p-8">Candidates List</div>} />
          <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/candidates" element={<PartnerCandidates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
