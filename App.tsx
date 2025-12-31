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
import Reports from "./pages/web/Reports";
import KYCWizard from "./pages/web/KYCWizard";
import Tickets from "./pages/web/ticket/Tickets";
import Settings from "./pages/web/Settings";
import TicketDetailPage from "./pages/web/ticket/detail/TicketDetail";
import Bookings from "./pages/web/booking/Bookings";
import BookingDetail from "./pages/web/booking/detail/BookingDetail";
import UsersManagement from "./pages/web/user/Users";

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
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
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
