import { useState } from "react";
import useAuthStore from "../../STORES/authStore";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const ROLE_CONFIG = {
  USER: {
    label: "Employee",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  MANAGER: {
    label: "Manager",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  SENIOR_MANAGER: {
    label: "Sr. Manager",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  COMPLIANCE_OFFICER: {
    label: "Compliance",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  ADMIN: {
    label: "Admin",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};
const ROLE_HOME = {
  USER: "/dashboard",
  MANAGER: "/manager",
  SENIOR_MANAGER: "/senior-manager",
  COMPLIANCE_OFFICER: "/compliance",
  ADMIN: "/admin",
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  console.log(user)
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG.USER;

  const handleLogout = async () => {
  try {
    await API.get("/logout")  // clears cookie on backend
  } catch (err) {
    console.error(err)
  } finally {
    logout()              // clears zustand store
    navigate("/login")    // redirect
  }
}

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "VF";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-100"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between h-full px-6">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3">
          {/* Icon mark */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 5V11M5 6.5L8 5L11 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Pulse dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full border border-white" />
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span
              className="text-[15px] font-bold tracking-tight text-gray-900"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
            >
              VeritasFlow
            </span>
            <span className="text-[9px] font-medium tracking-widest text-primary uppercase mt-0.5">
              Compliance Engine
            </span>
          </div>
        </div>

        {/* ── Center status bar (decorative, enterprise feel) ── */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] font-medium text-gray-400 tracking-wide">
            All systems operational
          </span>
        </div>

        {/* ── Right: User area ── */}
        <div className="flex items-center gap-3">

          {/* Role badge */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`} />
            {roleConfig.label}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200" />

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <span className="text-[11px] font-bold text-white tracking-wider">{initials}</span>
              </div>

              {/* Name */}
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[13px] font-semibold text-gray-800">
                  {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {user?.email ?? ""}
                </span>
              </div>

              {/* Chevron */}
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 py-1.5 z-50"
                style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)" }}
              >
                {/* User info header */}
                <div className="px-3.5 py-2.5 border-b border-gray-50">
                  <p className="text-[12px] font-semibold text-gray-800">
                    {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                  </p>
                  <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`} />
                    {roleConfig.label}
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => { navigate(ROLE_HOME[user?.role] || "/login"); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </button>

                  <button
                    onClick={() => { navigate("/change-password"); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </button>
                </div>

                <div className="border-t border-gray-50 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-red-500 hover:bg-red-50 transition-colors font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}