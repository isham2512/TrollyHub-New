import { useEffect, useState, useMemo } from "react";
import api from "../api";

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/orders/bills/all").then((res) => setBills(res.data));
  }, []);

  const filtered = useMemo(() =>
    bills.filter((b) => b.bill_number?.toString().includes(search) || (b.customer_mobile || "").includes(search)),
    [bills, search]
  );

  const totalRevenue = bills.reduce((s, b) => s + (b.final_amount || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .bills-page { display:flex; flex-direction:column; gap:20px; }
        .bills-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .bstat { background:#fff; border:1.5px solid #dbeadf; border-radius:18px; padding:18px 20px; }
        .bstat-label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:#9ab8a5; margin-bottom:6px; }
        .bstat-value { font-size:26px; font-weight:800; color:#173223; }
        .bstat-value.green { color:#1f8f4e; }
        .bills-toolbar { display:flex; align-items:center; gap:12px; }
        .bills-search { flex:1; display:flex; align-items:center; gap:8px; background:#fff; border:1.5px solid #d4e8db; border-radius:14px; padding:10px 14px; transition:border-color .2s,box-shadow .2s; }
        .bills-search:focus-within { border-color:#1f8f4e; box-shadow:0 0 0 3px rgba(31,143,78,.1); }
        .bills-search input { border:none; background:transparent; outline:none; width:100%; font-size:13.5px; color:#173223; }
        .bills-search input::placeholder { color:#9ab8a5; }
        .bills-count { font-size:13px; color:#7a9a87; font-weight:600; white-space:nowrap; }
        .bills-table-wrap { background:#fff; border:1.5px solid #dbeadf; border-radius:20px; overflow:hidden; }
        .bills-table { width:100%; border-collapse:collapse; }
        .bills-table thead tr { background:#f5fbf7; }
        .bills-table th { padding:12px 16px; font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#7a9a87; text-align:left; border-bottom:1.5px solid #dbeadf; white-space:nowrap; }
        .bills-table tbody tr { transition:background .15s; }
        .bills-table tbody tr:hover { background:#f9fdfb; }
        .bills-table td { padding:14px 16px; font-size:13.5px; color:#2d4a38; border-bottom:1px solid #f0f7f2; vertical-align:middle; }
        .bills-table tbody tr:last-child td { border-bottom:none; }
        .bill-num { font-weight:700; color:#1f8f4e; font-size:14px; }
        .bill-date { color:#7a9a87; font-size:12.5px; }
        .amount-cell { font-weight:700; color:#173223; }
        .tax-chip { background:#f0faf4; color:#1f8f4e; font-size:11.5px; font-weight:600; padding:3px 9px; border-radius:50px; }
        .disc-chip { background:#fff8f0; color:#c47a2a; font-size:11.5px; font-weight:600; padding:3px 9px; border-radius:50px; }
        .final-chip { background:#173223; color:#5dde8e; font-size:13px; font-weight:800; padding:5px 12px; border-radius:50px; }
        .zero-chip { color:#c0d8cb; font-size:12px; }
        .bills-empty { padding:60px 20px; text-align:center; color:#9ab8a5; }
        .bills-empty-icon { font-size:40px; margin-bottom:10px; }
        @media(max-width:700px){.bills-stats{grid-template-columns:1fr 1fr}}
      `}</style>
      <div className="bills-page">
        {/* Stats */}
        <div className="bills-stats">
          <div className="bstat">
            <div className="bstat-label">Total Bills</div>
            <div className="bstat-value">{bills.length}</div>
          </div>
          <div className="bstat">
            <div className="bstat-label">Total Revenue</div>
            <div className="bstat-value green">₹{totalRevenue.toLocaleString("en-IN", {minimumFractionDigits:2})}</div>
          </div>
          <div className="bstat">
            <div className="bstat-label">Avg. Bill Value</div>
            <div className="bstat-value">{bills.length ? `₹${(totalRevenue / bills.length).toFixed(0)}` : "—"}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bills-toolbar">
          <div className="bills-search">
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#9ab8a5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
            <input placeholder="Search bill number or mobile…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="bills-count">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Table */}
        <div className="bills-table-wrap">
          {filtered.length === 0 ? (
            <div className="bills-empty">
              <div className="bills-empty-icon">🧾</div>
              <div>No bills found</div>
            </div>
          ) : (
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Date & Time</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Discount</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id}>
                    <td><div className="bill-num">#{b.bill_number}</div></td>
                    <td><div className="bill-date">{new Date(b.created_at).toLocaleString("en-IN", {day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div></td>
                    <td><div className="amount-cell">₹{b.total_amount?.toFixed(2)}</div></td>
                    <td>{b.tax_amount > 0 ? <span className="tax-chip">+₹{b.tax_amount?.toFixed(2)}</span> : <span className="zero-chip">—</span>}</td>
                    <td>{b.discount > 0 ? <span className="disc-chip">−₹{b.discount?.toFixed(2)}</span> : <span className="zero-chip">—</span>}</td>
                    <td><span className="final-chip">₹{b.final_amount?.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
