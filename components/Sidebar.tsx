import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Ticket,
  LayoutGrid,
  Tags,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Users2,
  Wallet,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
  const isSettingsActive = location.pathname.startsWith("/settings");

  const navItemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive(path)
        ? "text-indigo-600 bg-indigo-50 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  const subNavItemClass = (path: string) =>
    `block pl-12 pr-4 py-2 text-sm transition-colors duration-200 ${
      isActive(path)
        ? "text-indigo-600 font-medium"
        : "text-gray-500 hover:text-gray-800"
    }`;

  return (
    <div className="w-58 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-10">
      {/* Logo Area */}
      <div className="p-6 flex justify-center items-center">
        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center border-2 border-orange-400">
          {/* Simple Logo Representation */}
          <div className="text-center">
            <div className="text-[10px] font-bold tracking-widest text-gray-800">
              JUST
            </div>
            <div className="text-3xl font-bold text-orange-500 leading-none">
              M
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 text-sm px-4 space-y-1 overflow-y-auto no-scrollbar pb-20">
        <NavLink to="/" className={navItemClass("/")}>
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tickets" className={navItemClass("/tickets")}>
          <Ticket size={20} />
          <span>Tickets</span>
        </NavLink>

        <NavLink to="/bookings" className={navItemClass("/bookings")}>
          <LayoutGrid size={20} />
          <span>My Bookings</span>
        </NavLink>

        <NavLink to="/categories" className={navItemClass("/categories")}>
          <LayoutGrid size={20} />
          <span>Categories</span>
        </NavLink>


        <NavLink to="/countries" className={navItemClass("/countries")}>
          <LayoutGrid size={20} />
          <span>Countries</span>
        </NavLink>

        <NavLink to="/cities" className={navItemClass("/cities")}>
          <LayoutGrid size={20} />
          <span>Cities</span>
        </NavLink>

        <NavLink to="/wallet" className={navItemClass('/wallet')}>
          <Wallet size={20} />
          <span>Wallet</span>
        </NavLink>


        <NavLink to="/users" className={navItemClass("/users")}>
          <Users2 size={20} />
          <span>Users Management</span>
        </NavLink>

        <NavLink to="/reports" className={navItemClass("/reports")}>
          <BarChart3 size={20} />
          <span>Reports</span>
        </NavLink>

        {/* Settings Group */}
        <div>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
              isSettingsActive
                ? "text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span>Setting</span>
            </div>
            {isSettingsOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {isSettingsOpen && (
            <div className="mt-1 space-y-1">
              <NavLink
                to="/settings/general"
                className={subNavItemClass("/settings/general")}
              >
                General Setting
              </NavLink>
              <NavLink
                to="/settings/kyc"
                className={subNavItemClass("/settings/kyc")}
              >
                KYC Setting
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Button (Sticky Bottom) */}
      <div className="p-4 border-t border-gray-100 absolute bottom-0 w-full bg-white">
        <button
          onClick={() => {
            setToken("");
            navigate("/login");
          }}
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
