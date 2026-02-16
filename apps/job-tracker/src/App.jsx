import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Saved from './pages/Saved';
import Digest from './pages/Digest';
import Proof from './pages/Proof';
import TestChecklist from './pages/TestChecklist';
import Ship from './pages/Ship';
import RBStep from './pages/rb/RBStep';
import RBProof from './pages/rb/RBProof';
import BuilderPage from './pages/BuilderPage';
import PreviewPage from './pages/PreviewPage';
import ResumeProofPage from './pages/ResumeProofPage';


function App() {
  return (
    <BrowserRouter>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation />

        <main style={{ flex: 1, backgroundColor: 'var(--color-bg)' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/proof" element={<ResumeProofPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/digest" element={<Digest />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/jt/proof" element={<Proof />} />
            <Route path="/jt/07-test" element={<TestChecklist />} />
            <Route path="/jt/08-ship" element={<Ship />} />

            {/* AI Resume Builder Routes */}
            <Route path="/rb/:stepId" element={<RBStep />} />
            <Route path="/rb/proof" element={<RBProof />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
