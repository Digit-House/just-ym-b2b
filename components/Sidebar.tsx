import { useUser } from "@/provider/UserProvider";
import useAuthStore from "@/store/useAuthStore";
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
    <div className="w-58 h-screen bg-white border-r fixed flex flex-col">
      {/* LOGO */}
      <div className="p-6 flex justify-center">
        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center border-2 border-orange-400">
          <div className="text-center">
            <div className="text-[10px] font-bold">JUST</div>
            <div className="text-3xl font-bold text-orange-500">M</div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-20">
        {NAV_CONFIG.map((item) => {
          if (!canShow(item.types)) return null;

          // SETTINGS DROPDOWN
          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
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

          // NORMAL LINK
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
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;