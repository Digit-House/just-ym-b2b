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
import Cart from "./pages/web/cart/Cart";
import Countries from "./pages/admin/countries/Countries";
import Cities from "./pages/admin/cities/Cities";
import Categories from "./pages/admin/categories/Categories";
import Wallet from "./pages/web/wallet/Wallet";
import Topup from "./pages/web/wallet/topup/Topup";
import TopUp from "./pages/admin/topUp/TopUp";
import Resellers from "./pages/admin/reseller/Resellers";
import Roles from "./pages/admin/role/Roles";
import PaymentMethods from "./pages/admin/paymentMethods/PaymentMethods";
import UserInfoPage from "./pages/web/ticket/userInfo/UserInfo";

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
            <Route path="tickets/user-info" element={<UserInfoPage />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="reports" element={<Reports />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="wallet/topup" element={<Topup />} />

            <Route path="settings">
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<Settings />} />
              <Route path="kyc" element={<KYCWizard />} />
            </Route>

            {/* ADMIN Routes */}
            <Route path="countries" element={<Countries />} />
            <Route path="cities" element={<Cities />} />
            <Route path="categories" element={<Categories />} />
            <Route path="topup" element={<TopUp />} />
            <Route path="resellers" element={<Resellers />} />
            <Route path="roles" element={<Roles />} />
            <Route path="paymentMethods" element={<PaymentMethods />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
