import { useUser } from "@/provider/UserProvider";
import useAuthStore from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { NAV_CONFIG, NavItem } from "@/types/navitem.type";
import { USER_TYPE } from "@/types/role.type";
import { ChevronDown, ChevronUp, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const TYPE = user.type as USER_TYPE;

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const navItemClass = (path: string) =>
    `flex items-center gap-3 px-2 py-3 rounded-lg text-md transition-colors ${
      isActive(path)
        ? "text-indigo-600 bg-indigo-50 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  const subNavItemClass = (path: string) =>
    `block pl-12 pr-4 py-2 text-sm ${
      isActive(path)
        ? "text-indigo-600 font-medium"
        : "text-gray-500 hover:text-gray-800"
    }`;

  const canShow = (roles: NavItem["types"]) =>
    roles === "ALL" || roles.includes(TYPE);

  return (
    <div
      className={`h-screen bg-white border-r fixed flex flex-col z-50  transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-58"
      }`}
    >
      {/* LOGO */}
      <div className="px-2 py-4 flex justify-center relative">
        <div className="flex items-center justify-center">
          <img 
            src="/img/logo.png" 
            alt="JustM Logo" 
            className={`transition-all duration-300 ${
              isCollapsed ? "w-10 h-10" : "w-14 h-14"
            } object-contain`}
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 w-6 h-6 bg-white rounded-full border shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {isCollapsed ? (
            <Menu size={14} className="text-gray-600" />
          ) : (
            <X size={14} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-20 scrollbar-hide">
        {NAV_CONFIG.map((item) => {
          if (!canShow(item.types)) return null;

          // SETTINGS DROPDOWN
          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 ${
                    isCollapsed ? "justify-center px-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed &&
                    (isSettingsOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </button>

                {!isCollapsed &&
                  isSettingsOpen &&
                  item.children.map(
                    (sub) =>
                      canShow(sub.types) && (
                        <NavLink
                          key={sub.path}
                          to={sub.path!}
                          className={subNavItemClass(sub.path!)}
                        >
                          {sub.label}
                        </NavLink>
                      )
                  )}
              </div>
            );
          }

          // NORMAL LINK
          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={`${navItemClass(item.path!)} ${
                isCollapsed ? "justify-center px-2" : ""
              }`}
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button
          onClick={() => {
            setToken("");
            navigate("/login");
          }}
          className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg transition-all duration-200 ${
            isCollapsed ? "px-2" : ""
          }`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
