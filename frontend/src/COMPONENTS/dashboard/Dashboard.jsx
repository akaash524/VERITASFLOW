import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../STORES/authStore";
import API from "../../api/axios";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage";

const StatCard = ({ label, value, icon, color, onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</p>
      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/user-api/transactions");
        setTransactions(res.data.payload || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions.");
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const stats = {
    total: transactions.length,
    pending: transactions.filter(t => t.status === "pending").length,
    successful: transactions.filter(t => t.status === "successful").length,
    rejected: transactions.filter(t => t.status === "rejected").length,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>Dashboard</h1>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-600">{user?.role}</span>
        </div>
        <p className="text-[13px] text-gray-400">Welcome back, <span className="text-gray-600 font-medium">{user?.firstName} {user?.lastName}</span>.</p>
      </div>

      {loading && <LoadingSpinner />}
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total" value={stats.total} color="bg-blue-50" onClick={() => navigate("/dashboard/transactions")}
              icon={<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>} />
            <StatCard label="Pending" value={stats.pending} color="bg-amber-50" onClick={() => navigate("/dashboard/transactions")}
              icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard label="Approved" value={stats.successful} color="bg-green-50"
              icon={<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard label="Rejected" value={stats.rejected} color="bg-red-50"
              icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 className="text-[13px] font-bold text-gray-800 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Risk Level Breakdown</h3>
            {stats.total === 0 ? (
              <div className="text-center py-6">
                <p className="text-[13px] text-gray-400">No transactions yet.</p>
                <button onClick={() => navigate("/dashboard/new")} className="mt-2 text-[12px] text-primary font-semibold hover:underline">Create your first transaction →</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {["LOW", "MEDIUM", "HIGH"].map(level => {
                  const count = transactions.filter(t => t.riskLevel === level).length;
                  const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                  const colors = { LOW: { bar: "bg-green-400", text: "text-green-700" }, MEDIUM: { bar: "bg-amber-400", text: "text-amber-700" }, HIGH: { bar: "bg-red-400", text: "text-red-700" } };
                  return (
                    <div key={level} className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold w-14 ${colors[level].text}`}>{level}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${colors[level].bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate("/dashboard/new")}
              className="flex items-center gap-3 p-4 bg-primary rounded-xl text-white hover:bg-[#1648c0] transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <div className="text-left">
                <p className="text-[13px] font-bold">New Transaction</p>
                <p className="text-[11px] text-blue-200">Submit for approval</p>
              </div>
            </button>
            <button onClick={() => navigate("/dashboard/transactions")}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </div>
              <div className="text-left">
                <p className="text-[13px] font-bold text-gray-700">My Transactions</p>
                <p className="text-[11px] text-gray-400">View history & audit trail</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}