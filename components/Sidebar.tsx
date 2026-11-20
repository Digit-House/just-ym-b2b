import { useResize } from "@/hooks/useResizer";
import { useUser } from "@/provider/UserProvider";
import useAuthStore from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { NAV_CONFIG, NavItem } from "@/types/navitem.type";
import { USER_TYPE } from "@/types/role.type";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutSession } from "@/graphql/session";
import { useReviewCount } from "@/hooks/useReviewCount";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const isDesktop = useResize();
  // Below the overlay breakpoint (useResize, 1024px) the sidebar must not stay open after a live resize or a navigation.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    // Close only on a crossing into mobile width: plain mobile resizes (address bar, keyboard) must not close it.
    let wasMobile = false;
    const close = () => {
      if (mq.matches && !wasMobile && useSidebarStore.getState().isOpen) toggleSidebar();
      wasMobile = mq.matches;
    };
    close();
    mq.addEventListener("change", close);
    window.addEventListener("resize", close); // fallback: same event useResize uses, in case "change" is not delivered
    return () => {
      mq.removeEventListener("change", close);
      window.removeEventListener("resize", close);
    };
  }, [toggleSidebar]);
  // isDesktop is the state that renders the overlay; closing on its flip keeps store and layout in step.
  useEffect(() => {
    if (!isDesktop && useSidebarStore.getState().isOpen) toggleSidebar();
  }, [isDesktop, toggleSidebar]);
  const TYPE = user?.type as USER_TYPE;
  const counts = useReviewCount(TYPE === "OWNER" || TYPE === "CONTENT_EDITOR");
  const isTicketsItem = (path?: string) => path === "/tickets" || path === "/content-tickets";

  const isActive = (path: string) => {
    const active =
      location.pathname === path ||
      (path === "/" && location.pathname === "") ||
      (path !== "/" && location.pathname.startsWith(path));

    return active;
  };

  // path === "/"
  //   ? location.pathname === "/"
  //   : location.pathname.startsWith(path);

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
    roles === "ALL" ? TYPE !== "CONTENT_EDITOR" : roles.includes(TYPE);

  return (
    <>
      {/* Overlay — only on mobile when sidebar is open */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          h-screen bg-white border-r flex flex-col z-40 top-0 left-0 w-64
          transition-transform duration-300 ease-in-out
          ${isDesktop ? "fixed" : "fixed"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
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
                        ),
                    )}
                </div>
              );
            }

            const countable = isTicketsItem(item.path) && (TYPE === "OWNER" || TYPE === "CONTENT_EDITOR");
            const rows = [
              { label: "In review", status: "READY_FOR_REVIEW", n: counts.readyForReview, cls: "bg-blue-100 text-blue-800" },
              { label: "Sent back", status: "SENT_BACK", n: counts.sentBack, cls: "bg-amber-100 text-amber-800" },
              { label: "In progress", status: "IN_PROGRESS", n: counts.inProgress, cls: "bg-gray-200 text-gray-700" },
            ];
            const currentReview = new URLSearchParams(location.search).get("review");
            // Counts sit inside the Tickets container: the container carries the background, the link row only hover.
            return (
              <div
                key={item.path}
                className={countable && isActive(item.path!) ? "rounded-lg bg-indigo-50" : "rounded-lg"}
              >
                <NavLink
                  to={item.path!}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-md transition-colors ${
                    isActive(item.path!)
                      ? `text-indigo-600 font-medium ${countable ? "" : "bg-indigo-50"}`
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
                {countable && (
                  <div className="space-y-0.5 pb-2 pr-2">
                    {rows.map((x) => {
                      const on = isActive(item.path!) && currentReview === x.status;
                      return (
                        <NavLink
                          key={x.status}
                          to={`${item.path}?review=${x.status}`}
                          className={`ml-10 flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-indigo-100/70 ${
                            on ? "bg-indigo-100 font-semibold text-indigo-700" : "text-gray-600"
                          }`}
                        >
                          <span>{x.label}</span>
                          <span
                            className={`min-w-[1.5rem] rounded-full px-2 py-0.5 text-center text-xs font-semibold ${
                              x.n > 0 ? x.cls : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {x.n}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <button
            onClick={async () => {
              // revoke the server-side session; still sign out locally if the call fails
              await logoutSession().catch(() => {});
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
