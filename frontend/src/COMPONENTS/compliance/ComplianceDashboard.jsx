import { useState, useEffect } from "react";
import useAuthStore from "../../STORES/authStore";
import API from "../../api/axios";

// ── Risk Badge ─────────────────────────────────────────────────────────────
const RiskBadge = ({ level }) => {
  const config = {
    LOW: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
    MEDIUM: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    HIGH: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    PENDING: { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200", dot: "bg-gray-400" },
  };
  const c = config[level] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {level}
    </span>
  );
};

// ── Action Modal ───────────────────────────────────────────────────────────
const ActionModal = ({ transaction, onClose, onSubmit, loading }) => {
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Final Compliance Review
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Level 3 — Compliance Officer · Final Decision</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Warning banner for final decision */}
        <div className="mx-6 mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-purple-50 border border-purple-100">
          <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-[11px] text-purple-700 font-medium">
            This is the <strong>final approval level</strong>. Your decision is irreversible and will be permanently logged.
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-50 mt-3 border-y border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Amount</p>
              <p className="text-[16px] font-bold text-gray-900">₹{transaction.amount?.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Risk Level</p>
              <RiskBadge level={transaction.riskLevel} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Operation</p>
              <p className="text-[12px] font-semibold text-gray-700">{transaction.operationType}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Risk Score</p>
              <p className="text-[12px] font-bold text-red-600">{transaction.riskScore} pts</p>
            </div>
          </div>

          {/* Full approval chain */}
          {transaction.approvalHistory?.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Approval Chain</p>
              <div className="flex flex-col gap-1.5">
                {transaction.approvalHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-mono w-10">L{h.level}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${h.action === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {h.action}
                    </span>
                    <span className="text-[11px] text-gray-500 flex-1">{h.comments || "No comments"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {transaction.riskReasons?.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Risk Reasons</p>
              <div className="flex flex-wrap gap-1">
                {transaction.riskReasons.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-[10px] text-red-600 font-medium">{r}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4">
          <p className="text-[12px] font-semibold text-gray-700 mb-3">Final Decision</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setAction("Approved")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 text-[13px] font-semibold transition-all
                ${action === "Approved" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-green-300"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => setAction("Rejected")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 text-[13px] font-semibold transition-all
                ${action === "Rejected" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-red-300"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-gray-700">
              Compliance Notes <span className="text-red-400 text-[10px]">*recommended</span>
            </label>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Document your compliance reasoning..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ action, comments })}
            disabled={!action || loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${action === "Approved" ? "bg-green-600 hover:bg-green-700 text-white" :
                action === "Rejected" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-200 text-gray-400"}`}
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <>Confirm Final Decision</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Rules Panel ────────────────────────────────────────────────────────────
const RulesPanel = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", field: "", operator: "GT", value: "", score: "", reason: "" });
  const [addLoading, setAddLoading] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await API.get("/co-api/rules");
      setRules(res.data.payload || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleAdd = async () => {
    setAddLoading(true);
    try {
      await API.post("/co-api/rules", {
        name: form.name,
        condition: { field: form.field, operator: form.operator, value: Number(form.value) },
        score: Number(form.score),
        reason: form.reason,
        isActive: true,
      });
      setShowAdd(false);
      setForm({ name: "", field: "", operator: "GT", value: "", score: "", reason: "" });
      fetchRules();
    } catch (err) { console.error(err); }
    finally { setAddLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/co-api/rules/${id}`);
      fetchRules();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-gray-800" style={{ fontFamily: "'Syne', sans-serif" }}>
          Risk Rules Engine
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-semibold hover:bg-purple-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Rule
        </button>
      </div>

      {/* Add rule form */}
      {showAdd && (
        <div className="px-5 py-4 bg-purple-50 border-b border-purple-100">
          <p className="text-[12px] font-bold text-purple-800 mb-3">New Compliance Rule</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Rule Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="HIGH_VALUE_TRANSFER" className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[12px] outline-none focus:border-purple-400 bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Field</label>
              <input value={form.field} onChange={e => setForm({...form, field: e.target.value})}
                placeholder="amount" className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[12px] outline-none focus:border-purple-400 bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Operator</label>
              <select value={form.operator} onChange={e => setForm({...form, operator: e.target.value})}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[12px] outline-none focus:border-purple-400 bg-white">
                <option value="GT">GT (greater than)</option>
                <option value="LT">LT (less than)</option>
                <option value="EQ">EQ (equals)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Value</label>
              <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})}
                placeholder="100000" className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[12px] outline-none focus:border-purple-400 bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Score</label>
              <input type="number" value={form.score} onChange={e => setForm({...form, score: e.target.value})}
                placeholder="40" className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[12px] outline-none focus:border-purple-400 bg-white" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Reason</label>
              <input value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
                placeholder="Exceeds threshold" className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-[12px] outline-none focus:border-purple-400 bg-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-white transition-colors">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={addLoading}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50">
              {addLoading ? "Adding..." : "Add Rule"}
            </button>
          </div>
        </div>
      )}

      {/* Rules list */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <svg className="w-5 h-5 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[13px] text-gray-400">No rules configured yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {rules.map(rule => (
            <div key={rule._id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[12px] font-bold text-gray-800 font-mono">{rule.name}</p>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${rule.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {rule.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">{rule.reason}</p>
                <p className="text-[10px] text-gray-300 font-mono mt-0.5">
                  {rule.condition?.field} {rule.condition?.operator} {rule.condition?.value} → +{rule.score} pts
                </p>
              </div>
              <button
                onClick={() => handleDelete(rule._id)}
                className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function ComplianceDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("approvals");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await API.get("/co-api/transactions/pending");
      setTransactions(res.data.payload || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async ({ action, comments }) => {
    setActionLoading(true);
    try {
      await API.post(`/co-api/transactions/${selectedTxn._id}/action`, { action, comments });
      showToast(`Transaction ${action} successfully. Audit log updated.`, action === "Approved" ? "success" : "error");
      setSelectedTxn(null);
      fetchPending();
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed.", "error");
    } finally { setActionLoading(false); }
  };

  const TABS = [
    { id: "approvals", label: "Final Approvals" },
    { id: "rules", label: "Risk Rules" },
  ];

  return (
    <div className="max-w-5xl mx-auto">

      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-[13px] font-semibold
          ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                Compliance Dashboard
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[10px] font-semibold text-purple-600 tracking-wide">
                LEVEL 3 · FINAL
              </span>
            </div>
            <p className="text-[13px] text-gray-400">
              Welcome, <span className="text-gray-600 font-medium">{user?.firstName} {user?.lastName}</span>. You have final authority on all HIGH risk transactions.
            </p>
          </div>
          <button onClick={fetchPending} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150
              ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Approvals Tab ── */}
      {activeTab === "approvals" && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>{transactions.length}</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">Awaiting Final Decision</p>
            </div>
            <div className="bg-white rounded-xl border border-red-100 p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <p className="text-2xl font-bold text-red-600" style={{ fontFamily: "'Syne', sans-serif" }}>
                {transactions.filter(t => t.isFraud).length}
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">Fraud Flagged</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-gray-800" style={{ fontFamily: "'Syne', sans-serif" }}>
                Final Approval Queue
              </h3>
              {transactions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-semibold text-purple-600">
                  {transactions.length} pending
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <svg className="w-6 h-6 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[13px] font-semibold text-gray-600">All clear!</p>
                <p className="text-[12px] text-gray-400 mt-1">No transactions pending final review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Transaction ID", "Amount", "Operation", "Risk", "Score", "Fraud", "Approval Chain", "Date", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.map(txn => (
                      <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3"><span className="text-[11px] font-mono text-gray-500">{txn.transactionId || txn._id.slice(-8)}</span></td>
                        <td className="px-4 py-3"><span className="text-[13px] font-bold text-gray-900">₹{txn.amount?.toLocaleString("en-IN")}</span></td>
                        <td className="px-4 py-3"><span className="text-[11px] text-gray-500 font-medium">{txn.operationType}</span></td>
                        <td className="px-4 py-3"><RiskBadge level={txn.riskLevel} /></td>
                        <td className="px-4 py-3"><span className="text-[13px] font-bold text-red-600">{txn.riskScore}</span></td>
                        <td className="px-4 py-3">
                          {txn.isFraud
                            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[10px] font-bold text-red-700">⚠ FRAUD</span>
                            : <span className="text-[11px] text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] text-gray-500">{txn.approvalHistory?.length || 0}/2 approved</span>
                        </td>
                        <td className="px-4 py-3"><span className="text-[11px] text-gray-400">{new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span></td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedTxn(txn)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-semibold hover:bg-purple-700 transition-colors"
                          >
                            Final Review
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Rules Tab ── */}
      {activeTab === "rules" && <RulesPanel />}

      {selectedTxn && (
        <ActionModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
          onSubmit={handleAction}
          loading={actionLoading}
        />
      )}
    </div>
  );
}