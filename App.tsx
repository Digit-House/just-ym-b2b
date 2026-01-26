import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./provider/UserProvider";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/web/Dashboard";
import Reports from "./pages/web/Reports";
import KYCWizard from "./pages/web/KYCWizard";
import UserTickets from "./pages/web/ticket/Tickets";
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
import AdminTicketEdit from "./pages/admin/tickets/edit/[id]/TicketEdit";
import UserInfoPage from "./pages/web/ticket/userInfo/UserInfo";
import CurrencyRate from "./pages/admin/currencyRate/CurrencyRate";
import Checkout from "./pages/web/cart/checkout/Checkout";
import Preview from "./pages/web/cart/preview/Preview";
import Vouchers from "./pages/admin/vouchers/Vouchers";
import CreateVoucher from "./pages/admin/vouchers/create/CreateVoucher";
import EditVoucher from "./pages/admin/vouchers/edit/EditPage";

const App = () => {
  return (
    <UserProvider>
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
              <Route path="tickets" element={<UserTickets />} />
              <Route path="tickets/:id" element={<TicketDetailPage />} />
              <Route path="tickets/user-info" element={<UserInfoPage />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="bookings/:id" element={<BookingDetail />} />
              <Route path="reports" element={<Reports />} />
              <Route path="cart" element={<Cart />} />
              <Route path="cart/checkout" element={<Checkout />} />
              <Route path="cart/preview/:id" element={<Preview />} />
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
              <Route path="currencyRate" element={<CurrencyRate />} />
             
              <Route path="vouchers" element={<Vouchers />} />
              <Route path="admin-vouchers/create" element={<CreateVoucher />} />
              <Route path="admin-vouchers/:id" element={<EditVoucher />} />
              <Route
                path="admin-tickets/edit/:id"
                element={<AdminTicketEdit />}
              />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
