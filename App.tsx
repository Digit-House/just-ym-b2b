import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/web/Dashboard";
import MyBookings from "./pages/web/MyBookings";
import Vouchers from "./pages/web/Vouchers";
import Reports from "./pages/web/Reports";
import KYCWizard from "./pages/web/KYCWizard";
import Tickets from "./pages/web/Tickets";
import Settings from "./pages/web/Settings";

const App = () => {
  return (
    <Router>
    <Routes>
      {/* 🔓 Public */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* 🔐 Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="reports" element={<Reports />} />

          <Route path="settings">
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<Settings />} />
            <Route path="kyc" element={<KYCWizard />} />
          </Route>
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Router>
  );
};

export default App;
