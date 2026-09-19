import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/landing/Home';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';

import AdminSettings from './admin/AdminSettings';
import CMSHome from './admin/cms/CMSHome';
import CMSIdentity from './admin/cms/CMSIdentity';
import CMSHeaderFooter from './admin/cms/CMSHeaderFooter';
import CMSContact from './admin/cms/CMSContact';
import CMSTemplates from './admin/cms/CMSTemplates';
import CMSCatalog from './admin/cms/CMSCatalog';
import CMSCommunity from './admin/cms/CMSCommunity';
import CMSBlog from './admin/cms/CMSBlog';
import { ToastProvider } from './components/ui/Toast';

import ErrorBoundary from './components/ErrorBoundary';

import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Landing Page Publik */}
            <Route path="/" element={<Home />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />}>
                <Route index element={<CMSHome />} />
                <Route path="identity" element={<CMSIdentity />} />
                <Route path="layout" element={<CMSHeaderFooter />} />
                <Route path="contact" element={<CMSContact />} />
                <Route path="templates" element={<CMSTemplates />} />
                <Route path="catalog" element={<CMSCatalog />} />
                <Route path="community" element={<CMSCommunity />} />
                <Route path="blog" element={<CMSBlog />} />
              </Route>
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
