import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { TreksPage } from './pages/TreksPage';
import { TrekDetailPage } from './pages/TrekDetailPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { TrekkerDashboard } from './pages/TrekkerDashboard';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-mountain-theme text-black selection:bg-brand-primaryYellow selection:text-black">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/treks" element={<TreksPage />} />
                <Route path="/treks/:slug" element={<TrekDetailPage />} />
                
                {/* Dashboards & Profile */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                <Route path="/trekker/dashboard" element={<TrekkerDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Authentication */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />

                {/* Informational & Legal */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
