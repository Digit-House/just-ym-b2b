import { useUser } from "@/provider/UserProvider";
import useAuthStore from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { NAV_CONFIG, NavItem } from "@/types/navitem.type";
import { USER_TYPE } from "@/types/role.type";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const TYPE = user.type as USER_TYPE;

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const navItemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-md transition-colors ${
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
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`h-screen bg-white border-r fixed flex flex-col z-40 top-0 left-0 w-64 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="px-4 py-5 flex items-center justify-center border-b">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="w-14 h-14 object-contain"
          />
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV_CONFIG.map((item) => {
            if (!canShow(item.types)) return null;

            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    {isSettingsOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {isSettingsOpen &&
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

            return (
              <NavLink
                key={item.path}
                to={item.path!}
                className={navItemClass(item.path!)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
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
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;