import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import ErrorMessage from "../shared/ErrorMessage";


export default function NewTransaction() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ receiverId: "", amount: "", operationType: "TRANSFER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await API.post("/user-api/transaction/create", { ...form, amount: Number(form.amount) });
      setResult(res.data.payload);
      setForm({ receiverId: "", amount: "", operationType: "TRANSFER" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create transaction.");
    } finally { setLoading(false); }
  };

  const estimatedRisk = form.amount
    ? Number(form.amount) > 100000 ? { level: "HIGH", color: "text-red-600" }
    : Number(form.amount) > 10000 ? { level: "MEDIUM", color: "text-amber-600" }
    : { level: "LOW", color: "text-green-600" }
    : null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 mb-3 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>New Transaction</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Transaction will be evaluated by the risk engine automatically.</p>
      </div>

      {/* Success result */}
      {result && (
        <div className="mb-4 bg-white rounded-xl border border-green-100 p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-[13px] font-bold text-green-700">Transaction Submitted Successfully</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Risk Level</p>
              <p className={`text-[13px] font-bold mt-0.5 ${result.riskLevel === "HIGH" ? "text-red-600" : result.riskLevel === "MEDIUM" ? "text-amber-600" : "text-green-600"}`}>
                {result.riskLevel}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Risk Score</p>
              <p className="text-[13px] font-bold text-gray-900 mt-0.5">{result.riskScore} pts</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Status</p>
              <p className="text-[13px] font-bold text-gray-900 mt-0.5 capitalize">{result.status}</p>
            </div>
          </div>
          {result.riskReasons?.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Risk Reasons</p>
              <div className="flex flex-wrap gap-1">
                {result.riskReasons.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-[10px] text-red-600 font-medium">{r}</span>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => navigate("/dashboard/transactions")} className="mt-3 text-[12px] text-primary font-semibold hover:underline">
            View in My Transactions →
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-700">Receiver Email</label>
            <input type="text" value={form.receiverId} onChange={e => setForm({ ...form, receiverId: e.target.value })}
              placeholder="receiver@company.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] font-mono text-gray-900 placeholder-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-700">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] font-semibold">₹</span>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            {estimatedRisk && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">Estimated risk:</span>
                <span className={`text-[11px] font-bold ${estimatedRisk.color}`}>{estimatedRisk.level}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-700">Operation Type</label>
            <select value={form.operationType} onChange={e => setForm({ ...form, operationType: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all bg-white">
              <option value="TRANSFER">Transfer</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="DEPOSIT">Deposit</option>
            </select>
          </div>

          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
            <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              This transaction will be evaluated by the <strong>Risk Engine</strong> and routed to the appropriate approval workflow automatically.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-[#1648c0] text-white text-[13px] font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</>
            ) : (
              <>Submit Transaction<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}