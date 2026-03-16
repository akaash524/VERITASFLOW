import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../STORES/authStore";
import API from "../../api/axios";
import ErrorMessage from "../shared/ErrorMessage";

const PasswordInput = ({ label, value, show, onToggle, onChange, placeholder }) => (
<div className="flex flex-col gap-1.5">
    <label className="text-[12px] font-semibold text-gray-700">{label}</label>
    <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    </div>
    <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
    />
    <button type="button" onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
        {show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </svg>
        ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        )}
    </button>
    </div>
</div>
);

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);
    try {
      await API.put("/change-password", {
        email: user.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      if (err.response?.status === 401) return
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };



  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4", text: "text-red-600" };
    if (pwd.length < 8) return { label: "Fair", color: "bg-amber-400", width: "w-2/4", text: "text-amber-600" };
    if (pwd.length < 12) return { label: "Good", color: "bg-blue-400", width: "w-3/4", text: "text-blue-600" };
    return { label: "Strong", color: "bg-green-400", width: "w-full", text: "text-green-600" };
  };

  const strength = getStrength(form.newPassword);

  return (
    <div className="max-w-md mx-auto">

      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 mb-3 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Go Back
        </button>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
          Change Password
        </h1>
        <p className="text-[13px] text-gray-400 mt-0.5">
          Update your password for <span className="text-gray-600 font-medium">{user?.email}</span>
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
          <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-[13px] text-green-700 font-medium">{success}</p>
            <p className="text-[11px] text-green-500 mt-0.5">Redirecting you back...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>

        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-[11px] font-bold text-white">
              {`${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
            <p className="text-[11px] text-gray-400">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput
            label="Current Password"
            value={form.currentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
            onChange={e => setForm({ ...form, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />

          <PasswordInput
            label="New Password"
            value={form.newPassword}
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
            onChange={e => setForm({ ...form, newPassword: e.target.value })}
            placeholder="Enter new password"
          />

          {/* Strength indicator */}
          {strength && (
            <div className="flex flex-col gap-1 -mt-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
              </div>
              <p className={`text-[11px] font-medium ${strength.text}`}>{strength.label} password</p>
            </div>
          )}

          <PasswordInput
            label="Confirm New Password"
            value={form.confirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />

          {/* Match indicator */}
          {form.confirmPassword && (
            <p className={`text-[11px] font-medium -mt-2 ${form.newPassword === form.confirmPassword ? "text-green-600" : "text-red-500"}`}>
              {form.newPassword === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}

          {error && <ErrorMessage message={error} />}

          <button type="submit" disabled={loading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-[#1648c0] text-white text-[13px] font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1">
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>Updating...</>
            ) : (
              <>Update Password
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}