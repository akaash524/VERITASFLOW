import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage";

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

const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    successful: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/user-api/transactions");
      setTransactions(res.data.payload || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const fetchAudit = async (id) => {
    setAuditLoading(true);
    setSelectedAudit(null);
    setAuditError("");
    try {
      const res = await API.get(`/user-api/transactions/${id}/audit`);
      setSelectedAudit(res.data.payload);
    } catch (err) {
      setAuditError(err.response?.data?.message || "Failed to load audit trail.");
    } finally { setAuditLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 mb-2 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>My Transactions</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Full history with audit trail access.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchTransactions} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
          <button onClick={() => navigate("/dashboard/new")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-[#1648c0] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Transaction
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-gray-800" style={{ fontFamily: "'Syne', sans-serif" }}>Transaction History</h3>
            <span className="text-[11px] text-gray-400">{transactions.length} records</span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[13px] text-gray-400 mb-2">No transactions found.</p>
              <button onClick={() => navigate("/dashboard/new")} className="text-[12px] text-primary font-semibold hover:underline">
                Create your first transaction →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Transaction ID", "Amount", "Type", "Risk", "Status", "Level", "Date", "Audit"].map(h => (
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
                      <td className="px-4 py-3"><StatusBadge status={txn.status} /></td>
                      <td className="px-4 py-3"><span className="text-[12px] text-gray-500">{txn.currentApprovalLevel === 0 ? "Auto" : `Level ${txn.currentApprovalLevel}`}</span></td>
                      <td className="px-4 py-3"><span className="text-[11px] text-gray-400">{new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></td>
                      <td className="px-4 py-3">
                        <button onClick={() => fetchAudit(txn._id)} className="text-[11px] text-primary font-semibold hover:underline">View Trail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Audit Trail Panel */}
      {(auditLoading || selectedAudit || auditError) && (
        <div className="mt-4 bg-white rounded-xl border border-gray-100 p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-gray-800" style={{ fontFamily: "'Syne', sans-serif" }}>Audit Trail</h3>
            <button onClick={() => { setSelectedAudit(null); setAuditError(""); }} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {auditLoading && <LoadingSpinner />}
          {auditError && <ErrorMessage message={auditError} />}

          {selectedAudit && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Amount</p>
                  <p className="text-[13px] font-bold text-gray-900">₹{selectedAudit.amount?.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Risk Score</p>
                  <p className="text-[13px] font-bold text-gray-900">{selectedAudit.riskScore} pts</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Final Status</p>
                  <StatusBadge status={selectedAudit.status} />
                </div>
              </div>

              {selectedAudit.riskReasons?.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Risk Reasons</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAudit.riskReasons.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-[11px] text-red-600 font-medium">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">Approval History</p>
              {selectedAudit.approvalHistory?.length === 0 ? (
                <p className="text-[12px] text-gray-400">No approval actions yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedAudit.approvalHistory?.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${h.action === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        L{h.level}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[12px] font-semibold text-gray-800">{h.user?.firstName} {h.user?.lastName}</span>
                          <span className={`text-[10px] font-bold ${h.action === "Approved" ? "text-green-600" : "text-red-600"}`}>{h.action}</span>
                        </div>
                        {h.comments && <p className="text-[11px] text-gray-400">"{h.comments}"</p>}
                        <p className="text-[10px] text-gray-300 mt-0.5">{new Date(h.createdAt).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}