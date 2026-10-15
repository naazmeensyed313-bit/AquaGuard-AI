/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { WarmupBanner } from './components/layout/WarmupBanner';
import { ToastProvider } from './components/ui/Toast';

import { LandingPage } from './pages/Landing';
import { AnalyzePage } from './pages/Analyze';
import { ResultPage } from './pages/Result';
import { DashboardPage } from './pages/Dashboard';
import { HistoryPage } from './pages/History';
import { ComparePage } from './pages/Compare';
import { BatchUploadPage } from './pages/BatchUpload';
import { AboutPage } from './pages/About';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F2FBFF] text-[#021F27] selection:bg-[#22B3C1]/30">
          <WarmupBanner />
          <Header />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/result/:id" element={<ResultPage />} />
              <Route path="/result" element={<Navigate to="/result/sample-ward-12" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/batch" element={<BatchUploadPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <MobileNav />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
