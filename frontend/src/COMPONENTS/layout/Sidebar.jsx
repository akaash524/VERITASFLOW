import { NavLink, useLocation } from "react-router-dom";
import useAuthStore from "../../STORES/authStore";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Transaction: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  NewTransaction: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Approvals: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Rules: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Audit: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

// ── Role nav config ────────────────────────────────────────────────────────
const NAV_CONFIG = {
  USER: [
    { label: "Dashboard", path: "/dashboard", icon: "Dashboard" },
    { label: "My Transactions", path: "/dashboard/transactions", icon: "Transaction" },
    { label: "New Transaction", path: "/dashboard/new", icon: "NewTransaction" },
  ],
  MANAGER: [
    { label: "Dashboard", path: "/manager", icon: "Dashboard" , badge: true},
  ],
  SENIOR_MANAGER: [
    { label: "Dashboard", path: "/senior-manager", icon: "Dashboard" , badge: true},
  ],
  COMPLIANCE_OFFICER: [
    { label: "Approval Queue", path: "/compliance", icon: "Approvals", badge: true },
    { label: "Risk Rules", path: "/compliance", icon: "Rules" },
  ],
  ADMIN: [
    { label: "Dashboard", path: "/admin", icon: "Dashboard" },
    { label: "All Transactions", path: "/admin/transactions", icon: "Transaction" },
    { label: "Audit Logs", path: "/admin/audit", icon: "Audit" },
    { label: "Manage Rules", path: "/admin/rules", icon: "Rules" },
    { label: "Manage Users", path: "/admin/users", icon: "Users" },
  ],
};

const ROLE_THEME = {
  USER: {
    label: "Employee Portal",
    gradient: "from-blue-600 to-blue-700",
    accent: "text-blue-200",
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
    activeBorder: "border-blue-600",
    hoverBg: "hover:bg-gray-50",
  },
  MANAGER: {
    label: "Manager Portal",
    gradient: "from-amber-500 to-amber-600",
    accent: "text-amber-200",
    activeBg: "bg-amber-50",
    activeText: "text-amber-700",
    activeBorder: "border-amber-500",
    hoverBg: "hover:bg-gray-50",
  },
  SENIOR_MANAGER: {
    label: "Sr. Manager Portal",
    gradient: "from-orange-500 to-orange-600",
    accent: "text-orange-200",
    activeBg: "bg-orange-50",
    activeText: "text-orange-700",
    activeBorder: "border-orange-500",
    hoverBg: "hover:bg-gray-50",
  },
  COMPLIANCE_OFFICER: {
    label: "Compliance Portal",
    gradient: "from-purple-600 to-purple-700",
    accent: "text-purple-200",
    activeBg: "bg-purple-50",
    activeText: "text-purple-700",
    activeBorder: "border-purple-600",
    hoverBg: "hover:bg-gray-50",
  },
  ADMIN: {
    label: "Admin Portal",
    gradient: "from-red-600 to-red-700",
    accent: "text-red-200",
    activeBg: "bg-red-50",
    activeText: "text-red-700",
    activeBorder: "border-red-600",
    hoverBg: "hover:bg-gray-50",
  },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();

  const role = user?.role || "USER";
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.USER;
  const theme = ROLE_THEME[role] || ROLE_THEME.USER;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-gray-100 flex flex-col z-40"
      style={{ boxShadow: "1px 0 3px rgba(0,0,0,0.04)" }}
    >
      {/* ── Role header ── */}
      <div className={`bg-linear-to-br ${theme.gradient} px-4 py-4`}>
        <p className={`text-[10px] font-semibold tracking-widest uppercase ${theme.accent} mb-1`}>
          Active Portal
        </p>
        <p className="text-white font-bold text-[13px]" style={{ fontFamily: "'Syne', sans-serif" }}>
          {theme.label}
        </p>

        {/* User quick info */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
          <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {`${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white text-[12px] font-semibold">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </span>
            <span className={`text-[10px] ${theme.accent} mt-0.5`}>
              {user?.email ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-3 mb-2">
          Navigation
        </p>

        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const IconComponent = Icons[item.icon];
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                    transition-all duration-150 relative group
                    border-l-2
                    ${isActive
                      ? `${theme.activeBg} ${theme.activeText} ${theme.activeBorder}`
                      : `border-transparent text-gray-600 ${theme.hoverBg} hover:text-gray-900`
                    }
                  `}
                >
                  {/* Icon */}
                  <span className={`shrink-0 transition-colors ${isActive ? theme.activeText : "text-gray-400 group-hover:text-gray-600"}`}>
                    <IconComponent />
                  </span>

                  {/* Label */}
                  <span className="flex-1 truncate">{item.label}</span>

                  {/* Badge for approvals */}
                  {item.badge && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-red-400 ring-2 ring-white" />
                  )}

                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom section ── */}
      <div className="px-4 py-3 border-t border-gray-100">
        {/* System status */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-gray-400 font-medium">Risk Engine Active</span>
          </div>
        </div>

        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold text-gray-700" style={{ fontFamily: "'Syne', sans-serif" }}>
              VeritasFlow
            </span>
            <span className="text-[9px] text-gray-400">v1.0.0 · Enterprise</span>
          </div>
        </div>
      </div>
    </aside>
  );
}