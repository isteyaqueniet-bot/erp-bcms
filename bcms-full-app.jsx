import { useState, useEffect, useMemo, useRef, createContext, useContext } from "react";
import {
  Layers, LayoutDashboard, Users, Clock, Wallet, TrendingUp, GraduationCap, Stethoscope,
  LogOut, Circle, Lock, Mail, Search, Plus, X, ChevronLeft, ChevronRight,
  UserCheck, UserX, Coffee, CalendarClock, Calendar, IndianRupee, TrendingDown,
  AlertCircle, CheckCircle2, Building2, ShieldCheck, LayoutGrid, Pill, FlaskConical, Package,
  Globe, FileText, Newspaper, Image as ImageIcon, Settings, Inbox, ChevronUp, ChevronDown,
  Trash2, Star, Upload, ExternalLink, RefreshCw,
} from "lucide-react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`;

const MODULES = [
  { key: "erp", label: "ERP", color: "#E8A94A" },
  { key: "crm", label: "CRM", color: "#5BA8E0" },
  { key: "school", label: "School", color: "#8B7FE8" },
  { key: "hospital", label: "Hospital", color: "#E07BA0" },
];

// Org-scoped users (Org Admin, Manager, Employee, etc.) see the operational
// modules for their own organization. Super Admins operate one level up —
// across every tenant — so they get a different, single-purpose nav instead.
const ORG_NAV_ITEMS = [
  { key: "overview",   label: "Overview",   icon: LayoutDashboard },
  { key: "employees",  label: "Employees",  icon: Users },
  { key: "attendance", label: "Attendance", icon: Clock },
  { key: "payroll",    label: "Payroll",    icon: Wallet },
  { key: "crm",        label: "Pipeline",   icon: TrendingUp },
  { key: "school",     label: "School",     icon: GraduationCap },
  { key: "hospital",   label: "Hospital",   icon: Stethoscope },
  { key: "pharmacy",   label: "Pharmacy & Lab", icon: Pill },
  { key: "website",    label: "Website",    icon: Globe },
];
const SUPER_ADMIN_NAV_ITEMS = [
  { key: "organizations", label: "Organizations", icon: Building2 },
];

const isSuperAdmin = (user) => /super\s*admin/i.test(user?.role ?? "");

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtK = (n) => (n ? `₹${(Number(n) / 1000).toFixed(0)}K` : "—");

// =================================================================
// LOGIN
// =================================================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (!email || !password) { setError("Enter both email and password."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok && json.success) onLogin({ ...json.data.user, live: true });
      else setError(json.message || "Invalid credentials.");
    } catch {
      setError("Couldn't reach the BCMS API.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1319] text-[#E7EAEE] flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{FONTS}</style>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-md bg-[#E8A94A] flex items-center justify-center">
            <Layers size={16} className="text-[#171208]" />
          </div>
          <span className="font-['Space_Grotesk'] font-semibold text-[18px] tracking-tight">BCMS</span>
        </div>
        <div className="bg-[#171C24] border border-[#262D3A] rounded-xl p-6">
          <h1 className="font-['Space_Grotesk'] text-[17px] mb-1">Sign in</h1>
          <p className="text-[12px] text-[#8B94A3] mb-5">Access your organization's workspace</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-[#E8A94A] focus-within:border-[#E8A94A]">
              <Mail size={14} className="text-[#5B6472]" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com"
                className="bg-transparent text-[13px] w-full focus:outline-none placeholder:text-[#4A5261]" />
            </div>
            <div className="flex items-center gap-2 bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-[#E8A94A] focus-within:border-[#E8A94A]">
              <Lock size={14} className="text-[#5B6472]" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="bg-transparent text-[13px] w-full focus:outline-none placeholder:text-[#4A5261]" />
            </div>
            {error && <p className="text-[12px] text-[#E2665C]">{error}</p>}
            <button onClick={submit} disabled={loading}
              className="mt-1 bg-[#E8A94A] text-[#171208] font-medium py-2.5 rounded-md text-[14px] hover:bg-[#F0BB68] transition-colors disabled:opacity-40">
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px bg-[#2A3140] flex-1" />
              <span className="text-[11px] text-[#4A5261]">or preview without an account</span>
              <div className="h-px bg-[#2A3140] flex-1" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => onLogin({ name: "Org Admin (Preview)", role: "Organization Admin", email: "org.admin@vantage.preview", live: false })}
                className="flex-1 flex items-center justify-center gap-1.5 border border-[#2A3140] rounded-md py-2 text-[12px] text-[#8B94A3] hover:border-[#3A4250] hover:text-[#E7EAEE] transition-colors">
                <Users size={13} />Org Admin
              </button>
              <button onClick={() => onLogin({ name: "Super Admin (Preview)", role: "Super Admin", email: "super.admin@bcms.preview", live: false })}
                className="flex-1 flex items-center justify-center gap-1.5 border border-[#2A3140] rounded-md py-2 text-[12px] text-[#8B94A3] hover:border-[#3A4250] hover:text-[#E7EAEE] transition-colors">
                <ShieldCheck size={13} />Super Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// SHARED UI ATOMS
// =================================================================
function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-[#1E2530] flex items-center justify-center flex-shrink-0">
        <Icon size={15} style={{ color: tone ?? "#8B94A3" }} />
      </div>
      <div>
        <div className="font-['Space_Grotesk'] text-[18px] leading-none text-[#E7EAEE]">{value}</div>
        <div className="text-[12px] text-[#8B94A3] mt-1">{label}</div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// Network status — shared across every tab. The key distinction: in
// preview mode, falling back to demo data is the INTENDED experience
// (there's no real backend to reach), so it must never look like an
// error. In a real, logged-in session, the same fallback happening
// silently would hide a genuine outage from the person using the
// app — so only THAT case surfaces a visible banner.
// -----------------------------------------------------------------
const NetworkContext = createContext({
  isLive: false,
  retryKey: 0,
  reportError: () => {},
  reportSuccess: () => {},
  showToast: () => {},
});

function useApi(endpoint, extractKey) {
  const { isLive, retryKey, reportError, reportSuccess } = useContext(NetworkContext);
  const [data, setData] = useState(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(endpoint)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        const value = extractKey ? json?.data?.[extractKey] : json?.data;
        if (cancelled) return;
        if (value) {
          setData(value);
          setLive(true);
          if (isLive) reportSuccess();
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Only a real, logged-in session treats this as a reportable
        // failure — preview mode is expected to have no backend to reach.
        if (isLive) reportError(endpoint);
      });
    return () => { cancelled = true; };
  }, [endpoint, retryKey, isLive]);

  return [data, live];
}

/**
 * Shared write-path helper. Every "Add employee", "Move lead stage",
 * "Save settings" etc. action in this app goes through this instead of
 * a bare fetch(...).catch(() => {}) — so a failed save actually tells
 * the person it failed, rather than the UI optimistically updating
 * while the server silently never got the change.
 *
 * Preview mode is the one exception: there's no real backend to save
 * to, so a failure there is expected and never surfaces a toast —
 * same principle as useApi's read-path handling above.
 */
function useMutate() {
  const { isLive, showToast } = useContext(NetworkContext);

  return async function mutate(endpoint, options = {}, errorMessage = "Couldn't save your change — please try again.") {
    // Preview mode has no real backend to save to — local state IS the
    // source of truth there, so every change is treated as successful.
    // Without this, every optimistic update in preview mode would
    // immediately roll itself back, since there's nothing to actually
    // persist to.
    if (!isLive) {
      return { ok: true, data: null };
    }

    try {
      const res = await fetch(endpoint, options);
      if (!res.ok) {
        showToast(errorMessage, "error");
        return { ok: false, data: null };
      }
      const data = await res.json().catch(() => null);
      return { ok: true, data };
    } catch {
      showToast(errorMessage, "error");
      return { ok: false, data: null };
    }
  };
}

function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-4 md:inset-x-auto md:right-6 md:left-auto z-40 flex flex-col gap-2 md:max-w-sm">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-start gap-2.5 rounded-lg px-3.5 py-3 shadow-lg border text-[13px] ${
            t.type === "error" ? "bg-[#1E1517] border-[#E2665C]/40 text-[#F0A8A2]" : "bg-[#171C24] border-[#262D3A] text-[#E7EAEE]"
          }`}>
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: t.type === "error" ? "#E2665C" : "#4FBF8D" }} />
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

// =================================================================
// OVERVIEW
// =================================================================
function ModuleFingerprint({ enabled }) {
  return (
    <div className="flex items-center gap-1.5">
      {MODULES.map((m) => {
        const on = enabled.includes(m.key);
        return <span key={m.key} title={m.label}
          style={{ width: 8, height: 8, backgroundColor: on ? m.color : "transparent", borderColor: on ? m.color : "#3A4250" }}
          className="rounded-[2px] border" />;
      })}
    </div>
  );
}

function Overview({ setTab }) {
  const cards = [
    { key: "employees", title: "Team", desc: "24 present today · payroll last run ₹3,91,875 (paid)", icon: Users, color: "#E8A94A" },
    { key: "crm", title: "Sales pipeline", desc: "7 active leads worth ₹33.2L", icon: TrendingUp, color: "#5BA8E0" },
    { key: "school", title: "School", desc: "342 students · 12 fee accounts overdue", icon: GraduationCap, color: "#8B7FE8" },
    { key: "hospital", title: "Hospital", desc: "18 appointments today · ₹42.5K outstanding", icon: Stethoscope, color: "#E07BA0" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Space_Grotesk'] text-[18px]">Vantage Consulting</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <ModuleFingerprint enabled={["erp", "crm"]} />
            <span className="text-[12px] text-[#5B6472]">modules active</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard icon={Users} label="Employees" value={6} tone="#E8A94A" />
        <StatCard icon={TrendingUp} label="Open leads" value={7} tone="#5BA8E0" />
        <StatCard icon={GraduationCap} label="Students" value={342} tone="#8B7FE8" />
        <StatCard icon={Stethoscope} label="Appointments today" value={18} tone="#E07BA0" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <button key={card.key} onClick={() => setTab(card.key)}
            className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A4250] transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: `${card.color}1A` }}>
                <card.icon size={16} style={{ color: card.color }} />
              </div>
              <div>
                <div className="text-[14px] font-medium">{card.title}</div>
                <div className="text-[12px] text-[#8B94A3] mt-0.5">{card.desc}</div>
              </div>
            </div>
            <ChevronRight size={15} className="text-[#3A4250]" />
          </button>
        ))}
      </div>
    </div>
  );
}

// =================================================================
// EMPLOYEES (full directory)
// =================================================================
const EMP_STATUS = {
  active: { dot: "#4FBF8D", text: "text-[#4FBF8D]", label: "Active" },
  on_leave: { dot: "#C9A227", text: "text-[#C9A227]", label: "On leave" },
  suspended: { dot: "#E2665C", text: "text-[#E2665C]", label: "Suspended" },
  exited: { dot: "#5B6472", text: "text-[#5B6472]", label: "Exited" },
};
const DEMO_EMPLOYEES = [
  { id: 1, employee_code: "EMP-0001", first_name: "Meera", last_name: "Nair", designation: "Engineering Lead", department_name: "Engineering", status: "active" },
  { id: 2, employee_code: "EMP-0002", first_name: "Arjun", last_name: "Verma", designation: "Sales Manager", department_name: "Sales", status: "active" },
  { id: 3, employee_code: "EMP-0003", first_name: "Priya", last_name: "Shah", designation: "Accountant", department_name: "Finance", status: "on_leave" },
  { id: 4, employee_code: "EMP-0004", first_name: "Rahul", last_name: "Iyer", designation: "Support Associate", department_name: "Support", status: "active" },
  { id: 5, employee_code: "EMP-0005", first_name: "Kavya", last_name: "Reddy", designation: "Operations Analyst", department_name: "Operations", status: "suspended" },
  { id: 6, employee_code: "EMP-0006", first_name: "Dev", last_name: "Kapoor", designation: "Frontend Engineer", department_name: "Engineering", status: "active" },
];

function AddEmployeeModal({ onClose, onCreate, nextCode }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", designation: "", department_name: "Engineering" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = () => { if (!form.first_name.trim()) return; onCreate({ id: Date.now(), employee_code: nextCode, status: "active", ...form }); onClose(); };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#171C24] border border-[#2A3140] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div><h2 className="font-['Space_Grotesk'] text-[18px]">Add employee</h2><span className="text-[12px] text-[#5B6472] font-mono">{nextCode}</span></div>
          <button onClick={onClose} className="text-[#5B6472] hover:text-[#E7EAEE]"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input value={form.first_name} onChange={set("first_name")} placeholder="First name"
              className="flex-1 bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A] focus:border-[#E8A94A]" />
            <input value={form.last_name} onChange={set("last_name")} placeholder="Last name"
              className="flex-1 bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A] focus:border-[#E8A94A]" />
          </div>
          <input value={form.designation} onChange={set("designation")} placeholder="Designation"
            className="bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A] focus:border-[#E8A94A]" />
          <button onClick={submit} disabled={!form.first_name.trim()}
            className="bg-[#E8A94A] text-[#171208] font-medium py-2.5 rounded-md text-[14px] hover:bg-[#F0BB68] disabled:opacity-40">
            Add employee
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeesTab() {
  const [liveData] = useApi("/api/employees", "employees");
  const [employees, setEmployees] = useState(DEMO_EMPLOYEES);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const mutate = useMutate();
  useEffect(() => { if (liveData?.length) setEmployees(liveData); }, [liveData]);

  const filtered = useMemo(() => employees.filter((e) =>
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
    e.employee_code.toLowerCase().includes(query.toLowerCase())
  ), [employees, query]);

  const nextCode = `EMP-${String(employees.length + 1).padStart(4, "0")}`;

  const createEmployee = async (emp) => {
    setEmployees((prev) => [emp, ...prev]);
    const result = await mutate("/api/employees", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: emp.first_name, last_name: emp.last_name, designation: emp.designation, department_name: emp.department_name }),
    }, "Couldn't add this employee — please try again.");
    if (!result.ok) {
      setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="font-['Space_Grotesk'] text-[18px]">Employee directory</h2>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#E8A94A] text-[#171208] text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-[#F0BB68]">
          <Plus size={14} />Add employee
        </button>
      </div>
      <div className="flex items-center gap-2 bg-[#171C24] border border-[#262D3A] rounded-md px-3 py-1.5 mb-4">
        <Search size={14} className="text-[#5B6472]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or code…"
          className="bg-transparent text-[13px] w-full focus:outline-none placeholder:text-[#4A5261]" />
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map((e) => {
          const style = EMP_STATUS[e.status] ?? EMP_STATUS.active;
          return (
            <div key={e.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A4250] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#1E2530] flex items-center justify-center flex-shrink-0 font-['Space_Grotesk'] text-[13px] text-[#8B94A3]">
                  {e.first_name?.[0]}{e.last_name?.[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium truncate">{e.first_name} {e.last_name}</span>
                    <span className="text-[11px] text-[#4A5261] font-mono flex-shrink-0">{e.employee_code}</span>
                  </div>
                  <div className="text-[12px] text-[#8B94A3] mt-0.5">{e.designation}{e.department_name ? ` · ${e.department_name}` : ""}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Circle size={6} fill={style.dot} stroke="none" />
                <span className={`text-[12px] ${style.text}`}>{style.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      {modalOpen && <AddEmployeeModal onClose={() => setModalOpen(false)} onCreate={createEmployee} nextCode={nextCode} />}
    </div>
  );
}

// =================================================================
// ATTENDANCE (daily roster)
// =================================================================
const ATT_STATUS = {
  present: { color: "#4FBF8D", label: "Present", icon: UserCheck },
  half_day: { color: "#C9A227", label: "Half day", icon: Coffee },
  absent: { color: "#E2665C", label: "Absent", icon: UserX },
  leave: { color: "#5BA8E0", label: "Leave", icon: CalendarClock },
  holiday: { color: "#5B6472", label: "Holiday", icon: Calendar },
};
const DEMO_ROSTER = [
  { id: 1, employee_id: 1, employee_code: "EMP-0001", first_name: "Meera", last_name: "Nair", designation: "Engineering Lead", status: "present" },
  { id: 2, employee_id: 2, employee_code: "EMP-0002", first_name: "Arjun", last_name: "Verma", designation: "Sales Manager", status: "present" },
  { id: 3, employee_id: 3, employee_code: "EMP-0003", first_name: "Priya", last_name: "Shah", designation: "Accountant", status: "leave" },
  { id: 4, employee_id: 4, employee_code: "EMP-0004", first_name: "Rahul", last_name: "Iyer", designation: "Support Associate", status: "half_day" },
  { id: 5, employee_id: 5, employee_code: "EMP-0005", first_name: "Kavya", last_name: "Reddy", designation: "Operations Analyst", status: "absent" },
  { id: 6, employee_id: 6, employee_code: "EMP-0006", first_name: "Dev", last_name: "Kapoor", designation: "Frontend Engineer", status: "present" },
];

function StatusPicker({ current, onChange }) {
  return (
    <div className="flex gap-1.5">
      {Object.entries(ATT_STATUS).map(([key, cfg]) => (
        <button key={key} onClick={() => onChange(key)} title={cfg.label}
          className="w-7 h-7 rounded-md flex items-center justify-center border transition-all"
          style={{ borderColor: current === key ? cfg.color : "#2A3140", backgroundColor: current === key ? `${cfg.color}1A` : "transparent" }}>
          <Circle size={8} fill={current === key ? cfg.color : "#3A4250"} stroke="none" />
        </button>
      ))}
    </div>
  );
}

function AttendanceTab() {
  const [date, setDate] = useState(new Date());
  const isoDate = (d) => d.toISOString().slice(0, 10);
  const [liveData] = useApi(`/api/attendance?date=${isoDate(date)}`, "records");
  const [roster, setRoster] = useState(DEMO_ROSTER);
  const mutate = useMutate();
  useEffect(() => { if (liveData?.length) setRoster(liveData); }, [liveData]);

  const updateStatus = async (employeeId, newStatus) => {
    const previousStatus = roster.find((r) => r.employee_id === employeeId)?.status;
    setRoster((prev) => prev.map((r) => (r.employee_id === employeeId ? { ...r, status: newStatus } : r)));
    const result = await mutate("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId, attendance_date: isoDate(date), status: newStatus }) },
      "Couldn't save attendance — please try again.");
    if (!result.ok && previousStatus) {
      setRoster((prev) => prev.map((r) => (r.employee_id === employeeId ? { ...r, status: previousStatus } : r)));
    }
  };

  const shiftDay = (delta) => { const next = new Date(date); next.setDate(next.getDate() + delta); setDate(next); };
  const counts = useMemo(() => {
    const c = { present: 0, half_day: 0, absent: 0, leave: 0, holiday: 0 };
    roster.forEach((r) => { if (c[r.status] !== undefined) c[r.status]++; });
    return c;
  }, [roster]);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="font-['Space_Grotesk'] text-[18px]">Attendance</h2>
        <div className="flex items-center gap-2 bg-[#171C24] border border-[#262D3A] rounded-md px-2 py-1.5">
          <button onClick={() => shiftDay(-1)} className="text-[#8B94A3] hover:text-[#E7EAEE] p-1"><ChevronLeft size={16} /></button>
          <span className="text-[13px] font-mono px-2 min-w-[120px] text-center">{date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <button onClick={() => shiftDay(1)} className="text-[#8B94A3] hover:text-[#E7EAEE] p-1"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {Object.entries(ATT_STATUS).map(([key, cfg]) => (
          <div key={key} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: `${cfg.color}1A` }}>
              <cfg.icon size={15} style={{ color: cfg.color }} />
            </div>
            <div>
              <div className="font-['Space_Grotesk'] text-[20px] leading-none">{counts[key]}</div>
              <div className="text-[12px] text-[#8B94A3] mt-1">{cfg.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {roster.map((r) => {
          const cfg = ATT_STATUS[r.status] ?? ATT_STATUS.present;
          return (
            <div key={r.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A4250] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#1E2530] flex items-center justify-center flex-shrink-0 font-['Space_Grotesk'] text-[13px] text-[#8B94A3]">
                  {r.first_name?.[0]}{r.last_name?.[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium truncate">{r.first_name} {r.last_name}</span>
                    <span className="text-[11px] text-[#4A5261] font-mono flex-shrink-0">{r.employee_code}</span>
                  </div>
                  <div className="text-[12px] text-[#8B94A3] mt-0.5">{r.designation}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-[12px]" style={{ color: cfg.color }}>{cfg.label}</span>
                <StatusPicker current={r.status} onChange={(status) => updateStatus(r.employee_id, status)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =================================================================
// PAYROLL (runs + payslip drill-down)
// =================================================================
const RUN_STATUS = {
  draft: { dot: "#5B6472", text: "text-[#5B6472]", label: "Draft" },
  processed: { dot: "#C9A227", text: "text-[#C9A227]", label: "Processed" },
  paid: { dot: "#4FBF8D", text: "text-[#4FBF8D]", label: "Paid" },
};
const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DEMO_RUNS = [
  { id: 1, period_month: 7, period_year: 2026, status: "paid", total_gross: 412500, total_deductions: 20625, total_net: 391875 },
  { id: 2, period_month: 6, period_year: 2026, status: "paid", total_gross: 398000, total_deductions: 19900, total_net: 378100 },
];
const DEMO_PAYSLIPS = [
  { id: 1, employee_code: "EMP-0001", first_name: "Meera", last_name: "Nair", designation: "Engineering Lead", basic_salary: 120000, allowances: 12000, deductions: 6000, net_pay: 126000, status: "paid" },
  { id: 2, employee_code: "EMP-0002", first_name: "Arjun", last_name: "Verma", designation: "Sales Manager", basic_salary: 95000, allowances: 9500, deductions: 4750, net_pay: 99750, status: "paid" },
];

function PayrollTab() {
  const [liveRuns] = useApi("/api/payroll/runs", "runs");
  const [runs, setRuns] = useState(DEMO_RUNS);
  const [selectedId, setSelectedId] = useState(null);
  const [payslips, setPayslips] = useState(DEMO_PAYSLIPS);
  const mutate = useMutate();
  useEffect(() => { if (liveRuns?.length) setRuns(liveRuns); }, [liveRuns]);

  const loadDetail = (id) => {
    setSelectedId(id);
    fetch(`/api/payroll/runs/${id}`).then((r) => r.ok ? r.json() : Promise.reject())
      .then((json) => { if (json?.data?.payslips) setPayslips(json.data.payslips); }).catch(() => {});
  };

  const markPaid = async (id) => {
    const previousStatus = runs.find((r) => r.id === id)?.status;
    setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, status: "paid" } : r)));
    const result = await mutate(`/api/payroll/runs/${id}/mark-paid`, { method: "PUT" }, "Couldn't mark this run as paid — please try again.");
    if (!result.ok && previousStatus) {
      setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, status: previousStatus } : r)));
    }
  };

  const selected = runs.find((r) => r.id === selectedId);

  if (selected) {
    const style = RUN_STATUS[selected.status] ?? RUN_STATUS.draft;
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-1.5 text-[13px] text-[#8B94A3] hover:text-[#E7EAEE] mb-5">
          <ChevronLeft size={15} />All payroll runs
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Space_Grotesk'] text-[20px]">{MONTHS[selected.period_month]} {selected.period_year}</h2>
            <div className="flex items-center gap-1.5 mt-1"><Circle size={6} fill={style.dot} stroke="none" /><span className={`text-[12px] ${style.text}`}>{style.label}</span></div>
          </div>
          {selected.status !== "paid" && (
            <button onClick={() => markPaid(selected.id)}
              className="flex items-center gap-1.5 bg-[#E8A94A] text-[#171208] text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-[#F0BB68]">
              <CheckCircle2 size={14} />Mark as paid
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={IndianRupee} label="Total gross" value={fmt(selected.total_gross)} />
          <StatCard icon={TrendingDown} label="Total deductions" value={fmt(selected.total_deductions)} />
          <StatCard icon={Wallet} label="Total net pay" value={fmt(selected.total_net)} />
        </div>
        <div className="bg-[#171C24] border border-[#262D3A] rounded-lg overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-3 text-[11px] text-[#5B6472] border-b border-[#262D3A] uppercase tracking-wide">
              <span>Employee</span><span className="text-right">Basic</span><span className="text-right">Deductions</span><span className="text-right">Net pay</span>
            </div>
            {payslips.map((p) => (
              <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-3.5 border-b border-[#1E2530] last:border-0 items-center hover:bg-[#1A2029]">
                <div><div className="text-[13px] font-medium">{p.first_name} {p.last_name}</div><div className="text-[11px] text-[#5B6472] font-mono mt-0.5">{p.employee_code} · {p.designation}</div></div>
                <span className="text-right text-[13px] font-mono text-[#8B94A3]">{fmt(p.basic_salary)}</span>
                <span className="text-right text-[13px] font-mono text-[#E2665C]">-{fmt(p.deductions)}</span>
                <span className="text-right text-[14px] font-mono font-medium">{fmt(p.net_pay)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-['Space_Grotesk'] text-[18px] mb-5">Payroll</h2>
      <div className="flex flex-col gap-2">
        {runs.map((run) => {
          const style = RUN_STATUS[run.status] ?? RUN_STATUS.draft;
          return (
            <button key={run.id} onClick={() => loadDetail(run.id)}
              className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A4250] text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#1E2530] flex items-center justify-center font-['Space_Grotesk'] text-[12px] text-[#8B94A3]">
                  {MONTHS[run.period_month].slice(0, 3)}
                </div>
                <div>
                  <div className="text-[14px] font-medium">{MONTHS[run.period_month]} {run.period_year}</div>
                  <div className="flex items-center gap-1.5 mt-0.5"><Circle size={6} fill={style.dot} stroke="none" /><span className={`text-[12px] ${style.text}`}>{style.label}</span></div>
                </div>
              </div>
              <div className="text-right"><div className="text-[14px] font-mono font-medium">{fmt(run.total_net)}</div><div className="text-[11px] text-[#5B6472] mt-0.5">net pay</div></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =================================================================
// CRM (kanban)
// =================================================================
const STAGES = [
  { key: "new", label: "New", color: "#5B6472" }, { key: "contacted", label: "Contacted", color: "#5BA8E0" },
  { key: "qualified", label: "Qualified", color: "#8B7FE8" }, { key: "proposal", label: "Proposal", color: "#C9A227" },
  { key: "won", label: "Won", color: "#4FBF8D" }, { key: "lost", label: "Lost", color: "#E2665C" },
];
const DEMO_LEADS = [
  { id: 1, name: "Ananya Krishnan", company: "Fernhill Retail", stage: "new", estimated_value: 250000 },
  { id: 2, name: "Vikram Oberoi", company: "Oberoi Logistics", stage: "contacted", estimated_value: 480000 },
  { id: 3, name: "Sneha Pillai", company: "Pillai Diagnostics", stage: "qualified", estimated_value: 620000 },
  { id: 4, name: "Divya Menon", company: "Menon Academy", stage: "proposal", estimated_value: 890000 },
  { id: 5, name: "Karan Chopra", company: "Chopra & Sons", stage: "won", estimated_value: 540000 },
  { id: 6, name: "Ishita Rao", company: "Rao Hospitals", stage: "lost", estimated_value: 720000 },
];

function CRMTab() {
  const [liveLeads] = useApi("/api/leads", "leads");
  const [leads, setLeads] = useState(DEMO_LEADS);
  const [dragOver, setDragOver] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const mutate = useMutate();
  useEffect(() => { if (liveLeads?.length) setLeads(liveLeads); }, [liveLeads]);

  const byStage = useMemo(() => {
    const g = {}; STAGES.forEach((s) => { g[s.key] = []; });
    leads.forEach((l) => { if (g[l.stage]) g[l.stage].push(l); });
    return g;
  }, [leads]);

  const moveStage = async (id, stage) => {
    const previousStage = leads.find((l) => l.id === id)?.stage;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    const result = await mutate(`/api/leads/${id}/stage`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) },
      "Couldn't move this lead — please try again.");
    if (!result.ok && previousStage) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage: previousStage } : l)));
    }
  };

  const selectedLead = leads.find((l) => l.id === selectedId);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <h2 className="font-['Space_Grotesk'] text-[18px]">Pipeline</h2>
        <span className="text-[11px] text-[#5B6472] md:hidden">Tap a card to move it</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {STAGES.map((stage) => (
          <div key={stage.key}
            onDragOver={(e) => { e.preventDefault(); setDragOver(stage.key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("leadId")); if (id) moveStage(id, stage.key); setDragOver(null); }}
            className={`rounded-lg p-2.5 min-h-[360px] flex-shrink-0 w-[200px] md:w-auto md:flex-1 transition-colors ${dragOver === stage.key ? "bg-[#1E2530]" : "bg-[#12161D]"}`}>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5"><Circle size={6} fill={stage.color} stroke="none" /><span className="text-[12px] font-medium text-[#8B94A3]">{stage.label}</span></div>
              <span className="text-[11px] font-mono text-[#5B6472]">{byStage[stage.key]?.length ?? 0}</span>
            </div>
            <div className="flex flex-col gap-2">
              {byStage[stage.key]?.map((lead) => (
                <div key={lead.id} draggable
                  onDragStart={(e) => e.dataTransfer.setData("leadId", String(lead.id))}
                  onClick={() => setSelectedId(lead.id === selectedId ? null : lead.id)}
                  className={`bg-[#1A2029] border rounded-md p-3 cursor-pointer md:cursor-grab active:cursor-grabbing transition-colors ${
                    selectedId === lead.id ? "border-[#E8A94A] ring-1 ring-[#E8A94A]" : "border-[#262D3A] hover:border-[#3A4250]"
                  }`}>
                  <div className="text-[13px] font-medium truncate">{lead.name}</div>
                  <div className="text-[11px] text-[#8B94A3] truncate mt-0.5">{lead.company}</div>
                  <div className="text-[12px] font-mono text-[#4FBF8D] mt-2">{fmtK(lead.estimated_value)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Touch-friendly move sheet — HTML5 drag-and-drop above doesn't fire on
          touchscreens, so tapping a card selects it and this bar lets any
          device (phone included) move it to another stage in one tap. */}
      {selectedLead && (
        <div className="fixed inset-x-4 bottom-20 md:bottom-6 md:right-6 md:left-auto md:inset-x-auto z-30 bg-[#171C24] border border-[#2A3140] rounded-xl p-3 shadow-lg md:max-w-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="min-w-0">
              <div className="text-[13px] font-medium truncate">{selectedLead.name}</div>
              <div className="text-[11px] text-[#8B94A3] truncate">{selectedLead.company}</div>
            </div>
            <button onClick={() => setSelectedId(null)} className="text-[#5B6472] hover:text-[#E7EAEE] flex-shrink-0 ml-2"><X size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.filter((s) => s.key !== selectedLead.stage).map((stage) => (
              <button key={stage.key} onClick={() => { moveStage(selectedLead.id, stage.key); setSelectedId(null); }}
                className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-md border border-[#2A3140] text-[#8B94A3] hover:border-[#3A4250] hover:text-[#E7EAEE] transition-colors">
                <Circle size={6} fill={stage.color} stroke="none" />
                Move to {stage.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// SCHOOL (admissions + fees)
// =================================================================
const FEE_STATUS = { pending: "#5B6472", partial: "#C9A227", paid: "#4FBF8D", overdue: "#E2665C" };
const DEMO_STUDENTS = [
  { id: 1, admission_number: "ADM-2026-0001", first_name: "Aarav", last_name: "Sharma", grade: "Grade 5", section: "A", guardian_name: "Sunita Sharma", status: "active", fee_status: "paid" },
  { id: 2, admission_number: "ADM-2026-0002", first_name: "Diya", last_name: "Patel", grade: "Grade 5", section: "A", guardian_name: "Nikhil Patel", status: "active", fee_status: "partial" },
  { id: 3, admission_number: "ADM-2026-0003", first_name: "Ishaan", last_name: "Gupta", grade: "Grade 4", section: "A", guardian_name: "Rekha Gupta", status: "active", fee_status: "overdue" },
];

function SchoolTab() {
  const [liveStudents] = useApi("/api/students", "students");
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [query, setQuery] = useState("");
  useEffect(() => { if (liveStudents?.length) setStudents(liveStudents); }, [liveStudents]);

  const filtered = useMemo(() => students.filter((s) =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
    s.admission_number.toLowerCase().includes(query.toLowerCase())
  ), [students, query]);

  return (
    <div>
      <h2 className="font-['Space_Grotesk'] text-[18px] mb-5">Student directory</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <StatCard icon={Users} label="Total students" value={students.length} tone="#8B7FE8" />
        <StatCard icon={AlertCircle} label="Fees overdue" value={students.filter((s) => s.fee_status === "overdue").length} tone="#E2665C" />
      </div>
      <div className="flex items-center gap-2 bg-[#171C24] border border-[#262D3A] rounded-md px-3 py-1.5 mb-4">
        <Search size={14} className="text-[#5B6472]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or admission number…"
          className="bg-transparent text-[13px] w-full focus:outline-none placeholder:text-[#4A5261]" />
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map((s) => {
          const feeColor = FEE_STATUS[s.fee_status] ?? FEE_STATUS.pending;
          return (
            <div key={s.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A4250] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#1E2530] flex items-center justify-center flex-shrink-0 font-['Space_Grotesk'] text-[13px] text-[#8B94A3]">
                  {s.first_name?.[0]}{s.last_name?.[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium truncate">{s.first_name} {s.last_name}</span>
                    <span className="text-[11px] text-[#4A5261] font-mono flex-shrink-0">{s.admission_number}</span>
                  </div>
                  <div className="text-[12px] text-[#8B94A3] mt-0.5">{s.grade} - {s.section} · Guardian: {s.guardian_name}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Circle size={6} fill={feeColor} stroke="none" />
                <span className="text-[12px]" style={{ color: feeColor }}>{s.fee_status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =================================================================
// HOSPITAL (appointments + billing)
// =================================================================
const APPT_STATUS = {
  scheduled: { color: "#5BA8E0", label: "Scheduled" }, checked_in: { color: "#C9A227", label: "Checked in" },
  completed: { color: "#4FBF8D", label: "Completed" }, no_show: { color: "#E2665C", label: "No-show" },
};
const DEMO_APPTS = [
  { id: 1, scheduled_at: "2026-07-31 09:00:00", patient_first_name: "Farhan", patient_last_name: "Ali", mrn: "MRN-2026-0001", doctor_first_name: "Dr. Nisha", doctor_last_name: "Kapoor", department: "Cardiology", status: "completed" },
  { id: 2, scheduled_at: "2026-07-31 09:30:00", patient_first_name: "Leela", patient_last_name: "Menon", mrn: "MRN-2026-0002", doctor_first_name: "Dr. Nisha", doctor_last_name: "Kapoor", department: "Cardiology", status: "checked_in" },
  { id: 3, scheduled_at: "2026-07-31 10:15:00", patient_first_name: "Suresh", patient_last_name: "Kumar", mrn: "MRN-2026-0003", doctor_first_name: "Dr. Arvind", doctor_last_name: "Rao", department: "Orthopedics", status: "scheduled" },
];
const timeOf = (dt) => new Date(dt.replace(" ", "T")).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

function HospitalTab() {
  const [liveAppts] = useApi(`/api/appointments?date=2026-07-31`, "appointments");
  const [appts, setAppts] = useState(DEMO_APPTS);
  const mutate = useMutate();
  useEffect(() => { if (liveAppts?.length) setAppts(liveAppts); }, [liveAppts]);

  const updateStatus = async (id, status) => {
    const previousStatus = appts.find((a) => a.id === id)?.status;
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const result = await mutate(`/api/appointments/${id}/status`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) },
      "Couldn't update this appointment — please try again.");
    if (!result.ok && previousStatus) {
      setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status: previousStatus } : a)));
    }
  };

  return (
    <div>
      <h2 className="font-['Space_Grotesk'] text-[18px] mb-5">Hospital — today's appointments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <StatCard icon={Users} label="Appointments today" value={appts.length} tone="#E07BA0" />
        <StatCard icon={IndianRupee} label="Outstanding balance" value={fmt(42500)} tone="#E2665C" />
      </div>
      <div className="flex flex-col gap-2">
        {appts.map((a) => {
          const style = APPT_STATUS[a.status] ?? APPT_STATUS.scheduled;
          return (
            <div key={a.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A4250] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[12px] font-mono text-[#8B94A3] w-14 flex-shrink-0">{timeOf(a.scheduled_at)}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium truncate">{a.patient_first_name} {a.patient_last_name}</span>
                    <span className="text-[11px] text-[#4A5261] font-mono flex-shrink-0">{a.mrn}</span>
                  </div>
                  <div className="text-[12px] text-[#8B94A3] mt-0.5">{a.doctor_first_name} {a.doctor_last_name} · {a.department}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5"><Circle size={6} fill={style.color} stroke="none" /><span className="text-[12px]" style={{ color: style.color }}>{style.label}</span></div>
                {a.status === "scheduled" && (
                  <button onClick={() => updateStatus(a.id, "checked_in")} className="text-[11px] px-2 py-1 rounded border border-[#2A3140] text-[#8B94A3] hover:border-[#3A4250] hover:text-[#E7EAEE]">Check in</button>
                )}
                {a.status === "checked_in" && (
                  <button onClick={() => updateStatus(a.id, "completed")} className="text-[11px] px-2 py-1 rounded border border-[#4FBF8D] text-[#4FBF8D] hover:bg-[#4FBF8D]/10">Complete</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =================================================================
// PHARMACY & LAB (condensed for the app shell)
// =================================================================
const PRESCRIPTION_STATUS = {
  pending: { color: "#5B6472", label: "Pending" },
  partially_dispensed: { color: "#C9A227", label: "Partially dispensed" },
  dispensed: { color: "#4FBF8D", label: "Dispensed" },
};
const LAB_ORDER_STATUS = {
  ordered: { color: "#5BA8E0", label: "Ordered" },
  sample_collected: { color: "#C9A227", label: "Sample collected" },
  in_progress: { color: "#8B7FE8", label: "In progress" },
  completed: { color: "#4FBF8D", label: "Completed" },
};
const DEMO_MEDICINES = [
  { id: 1, name: "Paracetamol 500mg", category: "Analgesic", unit: "tablet", stock_quantity: 420, reorder_level: 100, unit_price: 2 },
  { id: 2, name: "Amoxicillin 250mg", category: "Antibiotic", unit: "capsule", stock_quantity: 45, reorder_level: 50, unit_price: 6 },
  { id: 3, name: "Cetirizine 10mg", category: "Antihistamine", unit: "tablet", stock_quantity: 8, reorder_level: 30, unit_price: 3 },
];
const DEMO_PRESCRIPTIONS = [
  { id: 1, patient_first_name: "Farhan", patient_last_name: "Ali", mrn: "MRN-2026-0001", status: "partially_dispensed" },
  { id: 2, patient_first_name: "Leela", patient_last_name: "Menon", mrn: "MRN-2026-0002", status: "pending" },
];
const DEMO_LAB_ORDERS = [
  { id: 1, patient_first_name: "Suresh", patient_last_name: "Kumar", mrn: "MRN-2026-0003", status: "in_progress", tests_total: 2, tests_completed: 1 },
  { id: 2, patient_first_name: "Neha", patient_last_name: "Sinha", mrn: "MRN-2026-0004", status: "completed", tests_total: 1, tests_completed: 1 },
];

function PharmacySection() {
  const [liveMeds] = useApi("/api/pharmacy/medicines", "medicines");
  const [livePrescriptions] = useApi("/api/pharmacy/prescriptions", "prescriptions");
  const [medicines, setMedicines] = useState(DEMO_MEDICINES);
  const [prescriptions, setPrescriptions] = useState(DEMO_PRESCRIPTIONS);
  const [view, setView] = useState("prescriptions");
  useEffect(() => { if (liveMeds?.length) setMedicines(liveMeds); }, [liveMeds]);
  useEffect(() => { if (livePrescriptions?.length) setPrescriptions(livePrescriptions); }, [livePrescriptions]);

  const lowStock = medicines.filter((m) => m.stock_quantity <= m.reorder_level);

  return (
    <div>
      <div className="flex items-center gap-1 bg-[#12161D] rounded-md p-1 w-fit mb-5">
        <button onClick={() => setView("prescriptions")} className={`px-3 py-1.5 rounded text-[12px] ${view === "prescriptions" ? "bg-[#1E2530] text-[#E7EAEE]" : "text-[#5B6472]"}`}>Prescriptions</button>
        <button onClick={() => setView("inventory")} className={`px-3 py-1.5 rounded text-[12px] ${view === "inventory" ? "bg-[#1E2530] text-[#E7EAEE]" : "text-[#5B6472]"}`}>Inventory</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard icon={Package} label="Medicines tracked" value={medicines.length} />
        <StatCard icon={AlertCircle} label="Low stock" value={lowStock.length} tone={lowStock.length > 0 ? "#E2665C" : "#8B94A3"} />
      </div>

      {view === "prescriptions" ? (
        <div className="flex flex-col gap-2">
          {prescriptions.map((p) => {
            const style = PRESCRIPTION_STATUS[p.status] ?? PRESCRIPTION_STATUS.pending;
            return (
              <div key={p.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex items-center justify-between hover:border-[#3A4250] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium">{p.patient_first_name} {p.patient_last_name}</span>
                    <span className="text-[11px] text-[#4A5261] font-mono">{p.mrn}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5"><Circle size={6} fill={style.color} stroke="none" /><span className="text-[12px]" style={{ color: style.color }}>{style.label}</span></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {medicines.map((m) => {
            const low = m.stock_quantity <= m.reorder_level;
            return (
              <div key={m.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[14px] font-medium">{m.name}</div>
                  <div className="text-[12px] text-[#8B94A3] mt-0.5">{m.category} · ₹{m.unit_price}/{m.unit}</div>
                </div>
                <div className="flex items-center gap-2">
                  {low && <AlertCircle size={13} className="text-[#E2665C]" />}
                  <span className={`text-[13px] font-mono ${low ? "text-[#E2665C]" : "text-[#8B94A3]"}`}>{m.stock_quantity} {m.unit}s in stock</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LabSection() {
  const [liveOrders] = useApi("/api/lab/orders", "orders");
  const [orders, setOrders] = useState(DEMO_LAB_ORDERS);
  useEffect(() => { if (liveOrders?.length) setOrders(liveOrders); }, [liveOrders]);

  const pendingCount = orders.filter((o) => o.status !== "completed").length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard icon={FlaskConical} label="Lab orders" value={orders.length} />
        <StatCard icon={AlertCircle} label="Awaiting results" value={pendingCount} tone={pendingCount > 0 ? "#C9A227" : "#8B94A3"} />
      </div>
      <div className="flex flex-col gap-2">
        {orders.map((o) => {
          const style = LAB_ORDER_STATUS[o.status] ?? LAB_ORDER_STATUS.ordered;
          return (
            <div key={o.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex items-center justify-between hover:border-[#3A4250] transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium">{o.patient_first_name} {o.patient_last_name}</span>
                  <span className="text-[11px] text-[#4A5261] font-mono">{o.mrn}</span>
                </div>
                <div className="text-[12px] text-[#8B94A3] mt-0.5">{o.tests_completed}/{o.tests_total} results in</div>
              </div>
              <div className="flex items-center gap-1.5"><Circle size={6} fill={style.color} stroke="none" /><span className="text-[12px]" style={{ color: style.color }}>{style.label}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PharmacyTab() {
  const [section, setSection] = useState("pharmacy");
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="font-['Space_Grotesk'] text-[18px]">Pharmacy & Laboratory</h2>
        <div className="flex items-center gap-1 bg-[#171C24] border border-[#262D3A] rounded-md p-1">
          <button onClick={() => setSection("pharmacy")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] transition-colors ${section === "pharmacy" ? "bg-[#1E2530] text-[#E7EAEE]" : "text-[#5B6472] hover:text-[#8B94A3]"}`}>
            <Pill size={14} />Pharmacy
          </button>
          <button onClick={() => setSection("lab")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] transition-colors ${section === "lab" ? "bg-[#1E2530] text-[#E7EAEE]" : "text-[#5B6472] hover:text-[#8B94A3]"}`}>
            <FlaskConical size={14} />Laboratory
          </button>
        </div>
      </div>
      {section === "pharmacy" ? <PharmacySection /> : <LabSection />}
    </div>
  );
}

// =================================================================
// WEBSITE / CMS (Pages, Blog, Media, Settings, Inbox)
// =================================================================
const WEBSITE_SECTIONS = [
  { key: "pages", label: "Pages", icon: FileText },
  { key: "blog", label: "Blog", icon: Newspaper },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "wsettings", label: "Settings", icon: Settings },
  { key: "inbox", label: "Inbox", icon: Inbox },
];
const WEBSITE_BLOCK_TYPES = [
  { type: "hero", label: "Hero" }, { type: "text", label: "Text" }, { type: "image", label: "Image" },
  { type: "services", label: "Services" }, { type: "gallery", label: "Gallery" },
  { type: "cta", label: "Call to action" }, { type: "contact_form", label: "Contact form" },
];
const DEMO_WEBSITE_PAGES = [
  { id: 1, title: "Home", slug: "home", is_homepage: true, status: "published" },
  { id: 2, title: "About", slug: "about", is_homepage: false, status: "published" },
  { id: 3, title: "Admissions", slug: "admissions", is_homepage: false, status: "draft" },
];
const DEMO_WEBSITE_PAGE_CONTENT = {
  1: [{ type: "hero", data: { headline: "Where every student's curiosity has room to grow", subheadline: "Small classes, real mentorship.", cta_text: "Schedule a visit", cta_link: "/admissions" } }],
};
const DEMO_WEBSITE_POSTS = [
  { id: 1, title: "Welcome back to the new school year", slug: "welcome-back", status: "published" },
  { id: 2, title: "Science fair highlights", slug: "science-fair-highlights", status: "draft" },
];
const DEMO_WEBSITE_MEDIA = [
  { id: 1, url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400", original_name: "campus-1.jpg" },
  { id: 2, url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400", original_name: "classroom.jpg" },
];
const DEMO_WEBSITE_SETTINGS = {
  site_title: "Vantage Consulting", tagline: "Strategy that ships", primary_color: "#5BA8E0",
  contact_email: "hello@vantage.com", contact_phone: "+91 98111 22334", contact_address: "Bengaluru, India",
};
const DEMO_WEBSITE_SUBMISSIONS = [
  { id: 1, name: "Ritu Sharma", email: "ritu.s@gmail.com", message: "Interested in your consulting packages.", status: "new" },
];

function WebsiteStatusBadge({ status }) {
  const style = status === "published" ? { color: "#4FBF8D", label: "Published" } : { color: "#5B6472", label: "Draft" };
  return <span className="flex items-center gap-1.5 text-[12px]" style={{ color: style.color }}><Circle size={6} fill={style.color} stroke="none" />{style.label}</span>;
}

function WebsiteBlockEditor({ block, onChange }) {
  const set = (key) => (e) => onChange({ ...block, data: { ...block.data, [key]: e.target.value } });
  const d = block.data ?? {};
  const inputCls = "bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A]";

  if (block.type === "hero") return (
    <div className="flex flex-col gap-2">
      <input value={d.headline ?? ""} onChange={set("headline")} placeholder="Headline" className={inputCls} />
      <input value={d.subheadline ?? ""} onChange={set("subheadline")} placeholder="Subheadline" className={inputCls} />
      <div className="flex gap-2">
        <input value={d.cta_text ?? ""} onChange={set("cta_text")} placeholder="Button text" className={`flex-1 ${inputCls}`} />
        <input value={d.cta_link ?? ""} onChange={set("cta_link")} placeholder="Button link" className={`flex-1 font-mono ${inputCls}`} />
      </div>
    </div>
  );
  if (block.type === "text") return (
    <div className="flex flex-col gap-2">
      <input value={d.heading ?? ""} onChange={set("heading")} placeholder="Heading (optional)" className={inputCls} />
      <textarea value={d.body ?? ""} onChange={set("body")} placeholder="Body text" rows={3} className={`${inputCls} resize-none`} />
    </div>
  );
  if (block.type === "image") return (
    <div className="flex flex-col gap-2">
      <input value={d.url ?? ""} onChange={set("url")} placeholder="Image URL (pick from Media tab)" className={`font-mono ${inputCls}`} />
      <input value={d.caption ?? ""} onChange={set("caption")} placeholder="Caption (optional)" className={inputCls} />
    </div>
  );
  if (block.type === "services") {
    const items = d.items ?? [];
    const updateItem = (i, field, value) => { const next = [...items]; next[i] = { ...next[i], [field]: value }; onChange({ ...block, data: { ...d, items: next } }); };
    return (
      <div className="flex flex-col gap-2">
        <input value={d.heading ?? ""} onChange={set("heading")} placeholder="Section heading" className={inputCls} />
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item.title ?? ""} onChange={(e) => updateItem(i, "title", e.target.value)} placeholder="Title" className={`flex-1 ${inputCls}`} />
            <input value={item.description ?? ""} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="Description" className={`flex-[2] ${inputCls}`} />
            <button onClick={() => onChange({ ...block, data: { ...d, items: items.filter((_, idx) => idx !== i) } })} className="text-[#5B6472] hover:text-[#E2665C] flex-shrink-0"><X size={14} /></button>
          </div>
        ))}
        <button onClick={() => onChange({ ...block, data: { ...d, items: [...items, { title: "", description: "" }] } })} className="text-[12px] text-[#E8A94A] hover:text-[#F0BB68] text-left">+ Add item</button>
      </div>
    );
  }
  if (block.type === "gallery") {
    const images = d.images ?? [];
    const updateImage = (i, field, value) => { const next = [...images]; next[i] = { ...next[i], [field]: value }; onChange({ ...block, data: { ...d, images: next } }); };
    return (
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <div key={i} className="flex gap-2">
            <input value={img.url ?? ""} onChange={(e) => updateImage(i, "url", e.target.value)} placeholder="Image URL" className={`flex-[2] font-mono ${inputCls}`} />
            <input value={img.caption ?? ""} onChange={(e) => updateImage(i, "caption", e.target.value)} placeholder="Caption" className={`flex-1 ${inputCls}`} />
            <button onClick={() => onChange({ ...block, data: { ...d, images: images.filter((_, idx) => idx !== i) } })} className="text-[#5B6472] hover:text-[#E2665C] flex-shrink-0"><X size={14} /></button>
          </div>
        ))}
        <button onClick={() => onChange({ ...block, data: { ...d, images: [...images, { url: "", caption: "" }] } })} className="text-[12px] text-[#E8A94A] hover:text-[#F0BB68] text-left">+ Add image</button>
      </div>
    );
  }
  if (block.type === "cta") return (
    <div className="flex flex-col gap-2">
      <input value={d.heading ?? ""} onChange={set("heading")} placeholder="Heading" className={inputCls} />
      <input value={d.subheading ?? ""} onChange={set("subheading")} placeholder="Subheading" className={inputCls} />
      <div className="flex gap-2">
        <input value={d.button_text ?? ""} onChange={set("button_text")} placeholder="Button text" className={`flex-1 ${inputCls}`} />
        <input value={d.button_link ?? ""} onChange={set("button_link")} placeholder="Button link" className={`flex-1 font-mono ${inputCls}`} />
      </div>
    </div>
  );
  if (block.type === "contact_form") return (
    <div className="flex flex-col gap-2">
      <input value={d.heading ?? ""} onChange={set("heading")} placeholder="Heading" className={inputCls} />
      <input value={d.subheading ?? ""} onChange={set("subheading")} placeholder="Subheading" className={inputCls} />
      <p className="text-[11px] text-[#5B6472]">Submissions land in the Inbox tab.</p>
    </div>
  );
  return null;
}

function WebsitePageEditor({ page, content, onClose, onSave }) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [blocks, setBlocks] = useState(content ?? []);
  const [addingBlock, setAddingBlock] = useState(false);

  const moveBlock = (i, dir) => {
    const next = [...blocks]; const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setBlocks(next);
  };
  const updateBlock = (i, updated) => setBlocks((prev) => prev.map((b, idx) => idx === i ? updated : b));
  const removeBlock = (i) => setBlocks((prev) => prev.filter((_, idx) => idx !== i));
  const addBlock = (type) => { setBlocks((prev) => [...prev, { type, data: {} }]); setAddingBlock(false); };
  const save = (status) => onSave({ title, slug, status, content: blocks });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="bg-[#12161D] border border-[#2A3140] rounded-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2530] sticky top-0 bg-[#12161D] rounded-t-xl">
          <h2 className="font-['Space_Grotesk'] text-[17px]">{page ? "Edit page" : "New page"}</h2>
          <button onClick={onClose} className="text-[#5B6472] hover:text-[#E7EAEE]"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title"
              className="flex-1 bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A]" />
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug"
              className="w-40 bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 text-[14px] font-mono focus:outline-none focus:ring-1 focus:ring-[#E8A94A]" />
          </div>
          <div className="text-[12px] text-[#8B94A3] uppercase tracking-wide mt-2">Content blocks</div>
          <div className="flex flex-col gap-3">
            {blocks.map((block, i) => (
              <div key={i} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] font-medium text-[#E8A94A] capitalize">{block.type.replace("_", " ")}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveBlock(i, -1)} className="text-[#5B6472] hover:text-[#E7EAEE] p-0.5"><ChevronUp size={14} /></button>
                    <button onClick={() => moveBlock(i, 1)} className="text-[#5B6472] hover:text-[#E7EAEE] p-0.5"><ChevronDown size={14} /></button>
                    <button onClick={() => removeBlock(i)} className="text-[#5B6472] hover:text-[#E2665C] p-0.5 ml-1"><Trash2 size={14} /></button>
                  </div>
                </div>
                <WebsiteBlockEditor block={block} onChange={(updated) => updateBlock(i, updated)} />
              </div>
            ))}
          </div>
          {addingBlock ? (
            <div className="flex flex-wrap gap-2">
              {WEBSITE_BLOCK_TYPES.map((bt) => (
                <button key={bt.type} onClick={() => addBlock(bt.type)}
                  className="text-[12px] px-3 py-1.5 rounded-md border border-[#2A3140] text-[#8B94A3] hover:border-[#3A4250] hover:text-[#E7EAEE] transition-colors">
                  {bt.label}
                </button>
              ))}
              <button onClick={() => setAddingBlock(false)} className="text-[12px] px-3 py-1.5 text-[#5B6472]">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setAddingBlock(true)} className="flex items-center gap-1.5 text-[13px] text-[#E8A94A] hover:text-[#F0BB68] w-fit">
              <Plus size={14} />Add block
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-6 py-4 border-t border-[#1E2530]">
          <button onClick={() => save("draft")} className="px-4 py-2 rounded-md text-[13px] border border-[#2A3140] text-[#8B94A3] hover:border-[#3A4250] hover:text-[#E7EAEE] transition-colors">Save draft</button>
          <button onClick={() => save("published")} className="px-4 py-2 rounded-md text-[13px] bg-[#E8A94A] text-[#171208] font-medium hover:bg-[#F0BB68] transition-colors">Publish</button>
        </div>
      </div>
    </div>
  );
}

function WebsitePagesSection() {
  const [livePages] = useApi("/api/website/pages", "pages");
  const [pages, setPages] = useState(DEMO_WEBSITE_PAGES);
  const [contentByPage, setContentByPage] = useState(DEMO_WEBSITE_PAGE_CONTENT);
  const [editingPage, setEditingPage] = useState(null);
  const mutate = useMutate();
  useEffect(() => { if (livePages?.length) setPages(livePages); }, [livePages]);

  const handleSave = async (data) => {
    if (editingPage === "new") {
      const newPage = { id: Date.now(), title: data.title, slug: data.slug, is_homepage: false, status: data.status };
      setPages((prev) => [...prev, newPage]);
      setContentByPage((prev) => ({ ...prev, [newPage.id]: data.content }));
      const result = await mutate("/api/website/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) },
        "Couldn't create this page — please try again.");
      if (!result.ok) {
        setPages((prev) => prev.filter((p) => p.id !== newPage.id));
        setContentByPage((prev) => { const next = { ...prev }; delete next[newPage.id]; return next; });
      }
    } else {
      const previousPage = pages.find((p) => p.id === editingPage.id);
      const previousContent = contentByPage[editingPage.id];
      setPages((prev) => prev.map((p) => p.id === editingPage.id ? { ...p, title: data.title, slug: data.slug, status: data.status } : p));
      setContentByPage((prev) => ({ ...prev, [editingPage.id]: data.content }));
      const result = await mutate(`/api/website/pages/${editingPage.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) },
        "Couldn't save these changes — please try again.");
      if (!result.ok && previousPage) {
        setPages((prev) => prev.map((p) => p.id === editingPage.id ? previousPage : p));
        setContentByPage((prev) => ({ ...prev, [editingPage.id]: previousContent }));
      }
    }
    setEditingPage(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h3 className="font-['Space_Grotesk'] text-[16px]">Pages</h3>
        <button onClick={() => setEditingPage("new")} className="flex items-center gap-1.5 bg-[#E8A94A] text-[#171208] text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-[#F0BB68]">
          <Plus size={14} />New page
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {pages.map((p) => (
          <button key={p.id} onClick={() => setEditingPage(p)}
            className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex items-center justify-between hover:border-[#3A4250] transition-colors text-left">
            <div className="flex items-center gap-2">
              {p.is_homepage && <Star size={13} className="text-[#E8A94A]" fill="#E8A94A" />}
              <span className="text-[14px] font-medium">{p.title}</span>
              <span className="text-[11px] text-[#4A5261] font-mono">/{p.slug}</span>
            </div>
            <WebsiteStatusBadge status={p.status} />
          </button>
        ))}
      </div>
      {editingPage && (
        <WebsitePageEditor
          page={editingPage === "new" ? null : editingPage}
          content={editingPage === "new" ? [] : (contentByPage[editingPage.id] ?? [])}
          onClose={() => setEditingPage(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function WebsiteBlogSection() {
  const [livePosts] = useApi("/api/website/blog", "posts");
  const [posts, setPosts] = useState(DEMO_WEBSITE_POSTS);
  const [editing, setEditing] = useState(null);
  const mutate = useMutate();
  useEffect(() => { if (livePosts?.length) setPosts(livePosts); }, [livePosts]);

  if (editing) {
    const isNew = editing === "new";
    const post = isNew ? { title: "", slug: "", excerpt: "", body: "" } : editing;
    return (
      <div>
        <button onClick={() => setEditing(null)} className="text-[13px] text-[#8B94A3] hover:text-[#E7EAEE] mb-5">← All posts</button>
        <WebsiteBlogEditor post={post} onSave={async (data) => {
          if (isNew) {
            const newPost = { id: Date.now(), ...data };
            setPosts((prev) => [newPost, ...prev]);
            const result = await mutate("/api/website/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) },
              "Couldn't create this post — please try again.");
            if (!result.ok) {
              setPosts((prev) => prev.filter((p) => p.id !== newPost.id));
            }
          } else {
            const previousPost = posts.find((p) => p.id === post.id);
            setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, ...data } : p));
            const result = await mutate(`/api/website/blog/${post.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) },
              "Couldn't save these changes — please try again.");
            if (!result.ok && previousPost) {
              setPosts((prev) => prev.map((p) => p.id === post.id ? previousPost : p));
            }
          }
          setEditing(null);
        }} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h3 className="font-['Space_Grotesk'] text-[16px]">Blog</h3>
        <button onClick={() => setEditing("new")} className="flex items-center gap-1.5 bg-[#E8A94A] text-[#171208] text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-[#F0BB68]">
          <Plus size={14} />New post
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {posts.map((p) => (
          <button key={p.id} onClick={() => setEditing(p)}
            className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex items-center justify-between hover:border-[#3A4250] transition-colors text-left">
            <div><div className="text-[14px] font-medium">{p.title}</div><div className="text-[11px] text-[#5B6472] font-mono mt-0.5">/{p.slug}</div></div>
            <WebsiteStatusBadge status={p.status} />
          </button>
        ))}
      </div>
    </div>
  );
}

function WebsiteBlogEditor({ post, onSave }) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [body, setBody] = useState(post.body ?? "");
  const inputCls = "bg-[#171C24] border border-[#2A3140] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A]";

  return (
    <div className="flex flex-col gap-3 max-w-xl">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className={`text-[15px] ${inputCls}`} />
      <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" className={`font-mono ${inputCls}`} />
      <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Excerpt" className={inputCls} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your post…" rows={8} className={`${inputCls} resize-none`} />
      <div className="flex items-center gap-2">
        <button onClick={() => onSave({ title, slug, excerpt, body, status: "draft" })}
          className="px-4 py-2 rounded-md text-[13px] border border-[#2A3140] text-[#8B94A3] hover:border-[#3A4250] hover:text-[#E7EAEE] transition-colors">Save draft</button>
        <button onClick={() => onSave({ title, slug, excerpt, body, status: "published" })}
          className="px-4 py-2 rounded-md text-[13px] bg-[#E8A94A] text-[#171208] font-medium hover:bg-[#F0BB68] transition-colors">Publish</button>
      </div>
    </div>
  );
}

function WebsiteMediaSection() {
  const [liveMedia] = useApi("/api/website/media", "media");
  const [media, setMedia] = useState(DEMO_WEBSITE_MEDIA);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const mutate = useMutate();
  const { isLive, showToast } = useContext(NetworkContext);
  useEffect(() => { if (liveMedia?.length) setMedia(liveMedia); }, [liveMedia]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    const optimistic = { id: Date.now(), url: localUrl, original_name: file.name };
    setMedia((prev) => [optimistic, ...prev]);

    if (!isLive) {
      // Preview mode: nothing to actually upload to — the local
      // preview is the whole experience, so it stays.
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/website/media", { method: "POST", body: formData });
      if (res.ok) {
        const json = await res.json();
        setMedia((prev) => prev.map((m) => m.id === optimistic.id ? json.data.media : m));
      } else {
        showToast("Upload failed — please try again.", "error");
        setMedia((prev) => prev.filter((m) => m.id !== optimistic.id));
      }
    } catch {
      showToast("Upload failed — please try again.", "error");
      setMedia((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const remove = async (id) => {
    const removed = media.find((m) => m.id === id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
    const result = await mutate(`/api/website/media/${id}`, { method: "DELETE" }, "Couldn't delete this file — please try again.");
    if (!result.ok && removed) {
      setMedia((prev) => [removed, ...prev]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h3 className="font-['Space_Grotesk'] text-[16px]">Media library</h3>
        <label className="flex items-center gap-1.5 bg-[#E8A94A] text-[#171208] text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-[#F0BB68] cursor-pointer">
          <Upload size={14} />{uploading ? "Uploading…" : "Upload"}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {media.map((m) => (
          <div key={m.id} className="group relative aspect-square rounded-lg overflow-hidden bg-[#171C24] border border-[#262D3A]">
            <img src={m.url} alt={m.original_name} className="w-full h-full object-cover" />
            <button onClick={() => remove(m.id)} className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={13} /></button>
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1.5 py-1 truncate">{m.original_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebsiteSettingsSection() {
  const [liveSettings] = useApi("/api/website/settings", "settings");
  const [form, setForm] = useState(DEMO_WEBSITE_SETTINGS);
  const [saved, setSaved] = useState(false);
  const mutate = useMutate();
  const { isLive } = useContext(NetworkContext);
  useEffect(() => { if (liveSettings) setForm((prev) => ({ ...prev, ...liveSettings })); }, [liveSettings]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const inputCls = "w-full bg-[#171C24] border border-[#2A3140] rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A]";

  const save = async () => {
    const result = await mutate("/api/website/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) },
      "Couldn't save settings — please try again.");
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="max-w-xl">
      <h3 className="font-['Space_Grotesk'] text-[16px] mb-5">Site settings</h3>
      <div className="flex flex-col gap-4">
        <div><label className="text-[12px] text-[#8B94A3] mb-1.5 block">Site title</label><input value={form.site_title ?? ""} onChange={set("site_title")} className={inputCls} /></div>
        <div><label className="text-[12px] text-[#8B94A3] mb-1.5 block">Tagline</label><input value={form.tagline ?? ""} onChange={set("tagline")} className={inputCls} /></div>
        <div>
          <label className="text-[12px] text-[#8B94A3] mb-1.5 block">Primary color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.primary_color ?? "#5BA8E0"} onChange={set("primary_color")} className="w-10 h-10 rounded-md border border-[#2A3140] bg-[#171C24] cursor-pointer" />
            <input value={form.primary_color ?? ""} onChange={set("primary_color")} className={`flex-1 font-mono ${inputCls}`} />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1"><label className="text-[12px] text-[#8B94A3] mb-1.5 block">Contact email</label><input value={form.contact_email ?? ""} onChange={set("contact_email")} className={`font-mono ${inputCls}`} /></div>
          <div className="flex-1"><label className="text-[12px] text-[#8B94A3] mb-1.5 block">Contact phone</label><input value={form.contact_phone ?? ""} onChange={set("contact_phone")} className={`font-mono ${inputCls}`} /></div>
        </div>
        <div><label className="text-[12px] text-[#8B94A3] mb-1.5 block">Address</label><input value={form.contact_address ?? ""} onChange={set("contact_address")} className={inputCls} /></div>
        <button onClick={save} className="bg-[#E8A94A] text-[#171208] font-medium py-2.5 rounded-md text-[14px] hover:bg-[#F0BB68] transition-colors w-fit px-6">
          {saved ? "Saved ✓" : "Save settings"}
        </button>
      </div>
    </div>
  );
}

function WebsiteInboxSection() {
  const [liveSubmissions] = useApi("/api/website/contact-submissions", "submissions");
  const [submissions, setSubmissions] = useState(DEMO_WEBSITE_SUBMISSIONS);
  const mutate = useMutate();
  useEffect(() => { if (liveSubmissions?.length) setSubmissions(liveSubmissions); }, [liveSubmissions]);

  const markRead = async (id) => {
    const previousStatus = submissions.find((s) => s.id === id)?.status;
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: "read" } : s));
    const result = await mutate(`/api/website/contact-submissions/${id}/status`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "read" }) },
      "Couldn't update this submission — please try again.");
    if (!result.ok && previousStatus) {
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: previousStatus } : s));
    }
  };

  return (
    <div>
      <h3 className="font-['Space_Grotesk'] text-[16px] mb-5">Contact submissions</h3>
      <div className="flex flex-col gap-2">
        {submissions.map((s) => (
          <div key={s.id} onClick={() => s.status === "new" && markRead(s.id)}
            className={`bg-[#171C24] border rounded-lg p-4 cursor-pointer transition-colors ${s.status === "new" ? "border-[#E8A94A]/40" : "border-[#262D3A]"}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[14px] font-medium">{s.name}</span>
              {s.status === "new" && <span className="text-[10px] bg-[#E8A94A] text-[#171208] px-1.5 py-0.5 rounded font-medium">NEW</span>}
            </div>
            <div className="text-[12px] text-[#5B6472] font-mono mb-2">{s.email}</div>
            <p className="text-[13px] text-[#8B94A3]">{s.message}</p>
          </div>
        ))}
        {submissions.length === 0 && <p className="text-[13px] text-[#5B6472] text-center py-10">No submissions yet.</p>}
      </div>
    </div>
  );
}

function WebsiteTab() {
  const [section, setSection] = useState("pages");
  const SectionContent = {
    pages: <WebsitePagesSection />, blog: <WebsiteBlogSection />, media: <WebsiteMediaSection />,
    wsettings: <WebsiteSettingsSection />, inbox: <WebsiteInboxSection />,
  }[section];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="font-['Space_Grotesk'] text-[18px]">Website</h2>
        <a href="#" className="flex items-center gap-1.5 text-[12px] text-[#8B94A3] hover:text-[#E7EAEE] transition-colors">
          <ExternalLink size={13} />View live site
        </a>
      </div>
      <div className="flex items-center gap-1 bg-[#171C24] border border-[#262D3A] rounded-md p-1 mb-6 w-fit overflow-x-auto">
        {WEBSITE_SECTIONS.map((s) => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] transition-colors flex-shrink-0 ${
              section === s.key ? "bg-[#1E2530] text-[#E7EAEE]" : "text-[#5B6472] hover:text-[#8B94A3]"
            }`}>
            <s.icon size={14} />{s.label}
          </button>
        ))}
      </div>
      {SectionContent}
    </div>
  );
}

// =================================================================
// ORGANIZATIONS (Super Admin — tenant management)
// =================================================================
const TENANT_STATUS = {
  active:      { dot: "#4FBF8D", text: "text-[#4FBF8D]", label: "Active" },
  trial:       { dot: "#C9A227", text: "text-[#C9A227]", label: "Trial" },
  suspended:   { dot: "#E2665C", text: "text-[#E2665C]", label: "Suspended" },
  cancelled:   { dot: "#5B6472", text: "text-[#5B6472]", label: "Cancelled" },
};
const DEMO_TENANTS = [
  { id: 1, name: "Greenfield Public School", subdomain: "greenfield", plan: "business", status: "active", modules_enabled: ["erp", "school"], users: 342 },
  { id: 2, name: "Carecore Diagnostics", subdomain: "carecore", plan: "enterprise", status: "active", modules_enabled: ["erp", "hospital"], users: 189 },
  { id: 3, name: "Lumen Retail Group", subdomain: "lumen-retail", plan: "business", status: "active", modules_enabled: ["erp", "crm"], users: 76 },
  { id: 4, name: "Northbridge Academy", subdomain: "northbridge", plan: "trial", status: "trial", modules_enabled: ["school"], users: 28 },
  { id: 5, name: "Vantage Consulting", subdomain: "vantage", plan: "enterprise", status: "active", modules_enabled: ["erp", "crm", "hospital"], users: 412 },
  { id: 6, name: "Riverside Medical Center", subdomain: "riverside-med", plan: "business", status: "suspended", modules_enabled: ["hospital"], users: 154 },
];

function TenantModuleFingerprint({ enabled }) {
  return (
    <div className="flex items-center gap-1.5" title={enabled.join(", ") || "No modules enabled"}>
      {MODULES.map((m) => {
        const on = enabled.includes(m.key);
        return <span key={m.key}
          style={{ width: 8, height: 8, backgroundColor: on ? m.color : "transparent", borderColor: on ? m.color : "#3A4250" }}
          className="rounded-[2px] border transition-all" />;
      })}
    </div>
  );
}

function NewTenantModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [plan, setPlan] = useState("trial");
  const [modules, setModules] = useState([]);

  const toggleModule = (key) => setModules((m) => (m.includes(key) ? m.filter((x) => x !== key) : [...m, key]));

  const submit = () => {
    if (!name.trim() || !subdomain.trim()) return;
    onCreate({ id: Date.now(), name: name.trim(), subdomain: subdomain.trim().toLowerCase().replace(/\s+/g, "-"), plan, status: "trial", modules_enabled: modules, users: 1 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#171C24] border border-[#2A3140] rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-['Space_Grotesk'] text-[18px]">New organization</h2>
          <button onClick={onClose} className="text-[#5B6472] hover:text-[#E7EAEE]"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] text-[#8B94A3] mb-1.5 block">Organization name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Greenfield Public School"
              className="w-full bg-[#0F1319] border border-[#2A3140] rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#E8A94A] focus:border-[#E8A94A]" />
          </div>
          <div>
            <label className="text-[12px] text-[#8B94A3] mb-1.5 block">Subdomain</label>
            <div className="flex items-center bg-[#0F1319] border border-[#2A3140] rounded-md focus-within:ring-1 focus-within:ring-[#E8A94A] focus-within:border-[#E8A94A]">
              <input value={subdomain} onChange={(e) => setSubdomain(e.target.value)} placeholder="greenfield"
                className="flex-1 bg-transparent px-3 py-2 text-[14px] focus:outline-none font-mono" />
              <span className="text-[13px] text-[#5B6472] pr-3 font-mono">.bcms.app</span>
            </div>
          </div>
          <div>
            <label className="text-[12px] text-[#8B94A3] mb-1.5 block">Plan</label>
            <div className="flex gap-2">
              {["trial", "business", "enterprise"].map((p) => (
                <button key={p} onClick={() => setPlan(p)}
                  className={`flex-1 py-1.5 rounded-md text-[13px] capitalize border transition-colors ${
                    plan === p ? "bg-[#E8A94A]/10 border-[#E8A94A] text-[#E8A94A]" : "border-[#2A3140] text-[#8B94A3] hover:border-[#3A4250]"
                  }`}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[12px] text-[#8B94A3] mb-1.5 block">Modules to enable</label>
            <div className="flex flex-wrap gap-2">
              {MODULES.map((m) => {
                const on = modules.includes(m.key);
                return (
                  <button key={m.key} onClick={() => toggleModule(m.key)}
                    className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-md text-[13px] border transition-colors"
                    style={{ borderColor: on ? m.color : "#2A3140", color: on ? m.color : "#8B94A3", backgroundColor: on ? `${m.color}1A` : "transparent" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: on ? m.color : "#3A4250" }} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={submit} disabled={!name.trim() || !subdomain.trim()}
            className="mt-2 bg-[#E8A94A] text-[#171208] font-medium py-2.5 rounded-md text-[14px] hover:bg-[#F0BB68] transition-colors disabled:opacity-40">
            Create organization
          </button>
        </div>
      </div>
    </div>
  );
}

function OrganizationsTab() {
  const [liveTenants] = useApi("/api/tenants", "tenants");
  const [tenants, setTenants] = useState(DEMO_TENANTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const mutate = useMutate();
  useEffect(() => { if (liveTenants?.length) setTenants(liveTenants); }, [liveTenants]);

  const filtered = useMemo(() => tenants.filter((t) => {
    const matchesQuery = t.name.toLowerCase().includes(query.toLowerCase()) || t.subdomain.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [tenants, query, statusFilter]);

  const stats = useMemo(() => {
    const active = tenants.filter((t) => t.status === "active").length;
    const trial = tenants.filter((t) => t.status === "trial").length;
    const totalUsers = tenants.reduce((sum, t) => sum + (t.users || 0), 0);
    const moduleUsage = MODULES.map((m) => ({ ...m, count: tenants.filter((t) => t.modules_enabled.includes(m.key)).length })).sort((a, b) => b.count - a.count);
    return { active, trial, totalUsers, moduleUsage };
  }, [tenants]);

  const createTenant = async (tenant) => {
    setTenants((prev) => [tenant, ...prev]);
    const result = await mutate("/api/tenants", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tenant.name, subdomain: tenant.subdomain, plan: tenant.plan, modules_enabled: tenant.modules_enabled }),
    }, "Couldn't create this organization — please try again.");
    if (!result.ok) {
      setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="font-['Space_Grotesk'] text-[18px]">Organizations</h2>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#E8A94A] text-[#171208] text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-[#F0BB68]">
          <Plus size={14} />New organization
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard icon={Building2} label="Organizations" value={tenants.length} />
        <StatCard icon={ShieldCheck} label="Active" value={stats.active} tone="#4FBF8D" />
        <StatCard icon={Users} label="Total users" value={stats.totalUsers.toLocaleString()} />
        <StatCard icon={LayoutGrid} label="Top module" value={stats.moduleUsage[0]?.label ?? "—"} tone={stats.moduleUsage[0]?.color} />
      </div>

      <div className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 md:p-5 mb-6">
        <div className="text-[13px] text-[#8B94A3] mb-4">Module adoption across all organizations</div>
        <div className="flex flex-col gap-3">
          {stats.moduleUsage.map((m) => (
            <div key={m.key} className="flex items-center gap-3">
              <span className="w-14 md:w-16 text-[12px] text-[#8B94A3] flex-shrink-0">{m.label}</span>
              <div className="flex-1 h-1.5 bg-[#0F1319] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(m.count / tenants.length) * 100}%`, backgroundColor: m.color }} />
              </div>
              <span className="w-6 text-right text-[12px] font-mono text-[#5B6472] flex-shrink-0">{m.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[#171C24] border border-[#262D3A] rounded-md px-3 py-1.5 flex-1 min-w-[180px]">
          <Search size={14} className="text-[#5B6472]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search organizations…"
            className="bg-transparent text-[13px] w-full focus:outline-none placeholder:text-[#4A5261]" />
        </div>
        {["all", "active", "trial", "suspended"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-[12px] capitalize px-3 py-1.5 rounded-md border transition-colors ${
              statusFilter === s ? "bg-[#1E2530] border-[#3A4250] text-[#E7EAEE]" : "border-transparent text-[#5B6472] hover:text-[#8B94A3]"
            }`}>{s}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((t) => {
          const style = TENANT_STATUS[t.status] ?? TENANT_STATUS.trial;
          return (
            <div key={t.id} className="bg-[#171C24] border border-[#262D3A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3A4250] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-[#1E2530] flex items-center justify-center flex-shrink-0 font-['Space_Grotesk'] text-[13px] text-[#8B94A3]">{t.name.charAt(0)}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium truncate">{t.name}</span>
                    <span className="text-[11px] text-[#4A5261] font-mono flex-shrink-0">{t.subdomain}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <TenantModuleFingerprint enabled={t.modules_enabled} />
                    <span className="text-[11px] text-[#5B6472] font-mono">{t.users} users</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Circle size={6} fill={style.dot} stroke="none" />
                <span className={`text-[12px] ${style.text}`}>{style.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && <NewTenantModal onClose={() => setModalOpen(false)} onCreate={createTenant} />}
    </div>
  );
}

// =================================================================
// APP SHELL
// =================================================================
export default function BCMSApp() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [networkError, setNetworkError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };
  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Reset to the role-appropriate landing tab whenever a session starts —
  // covers first login and switching between the two preview roles.
  useEffect(() => {
    if (user) setTab(isSuperAdmin(user) ? "organizations" : "overview");
    setNetworkError(null);
  }, [user]);

  if (!user) return <LoginScreen onLogin={setUser} />;

  const navItems = isSuperAdmin(user) ? SUPER_ADMIN_NAV_ITEMS : ORG_NAV_ITEMS;

  const networkContextValue = {
    isLive: !!user.live,
    retryKey,
    reportError: (endpoint) => setNetworkError(endpoint),
    reportSuccess: () => setNetworkError(null),
    showToast,
  };

  const retry = () => { setNetworkError(null); setRetryKey((k) => k + 1); };

  const TabContent = {
    organizations: <OrganizationsTab />,
    overview: <Overview setTab={setTab} />,
    employees: <EmployeesTab />,
    attendance: <AttendanceTab />,
    payroll: <PayrollTab />,
    crm: <CRMTab />,
    school: <SchoolTab />,
    hospital: <HospitalTab />,
    pharmacy: <PharmacyTab />,
    website: <WebsiteTab />,
  }[tab];

  return (
    <NetworkContext.Provider value={networkContextValue}>
    <div className="min-h-screen bg-[#0F1319] text-[#E7EAEE] flex flex-col md:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{FONTS}</style>

      {/* Mobile top bar — replaces the sidebar header below md */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#1E2530] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#E8A94A] flex items-center justify-center"><Layers size={13} className="text-[#171208]" /></div>
          <span className="font-['Space_Grotesk'] font-semibold text-[14px]">BCMS</span>
        </div>
        <button onClick={() => setUser(null)} className="text-[#5B6472] p-1">
          <LogOut size={16} />
        </button>
      </div>

      {/* Desktop sidebar — hidden on mobile, replaced by the bottom tab bar */}
      <aside className="hidden md:flex w-56 border-r border-[#1E2530] flex-col flex-shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1E2530]">
          <div className="w-7 h-7 rounded-md bg-[#E8A94A] flex items-center justify-center"><Layers size={15} className="text-[#171208]" /></div>
          <span className="font-['Space_Grotesk'] font-semibold text-[15px]">BCMS</span>
        </div>
        <nav className="flex-1 py-3 px-2">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] mb-0.5 transition-colors ${
                tab === item.key ? "bg-[#1E2530] text-[#E7EAEE]" : "text-[#8B94A3] hover:bg-[#171C24] hover:text-[#E7EAEE]"
              }`}>
              <item.icon size={15} />{item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-[#1E2530] p-3">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-[#1E2530] flex items-center justify-center font-['Space_Grotesk'] text-[11px] text-[#8B94A3] flex-shrink-0">{user.name?.[0] ?? "U"}</div>
            <div className="min-w-0"><div className="text-[12px] truncate">{user.name}</div><div className="text-[11px] text-[#5B6472] truncate">{user.role}</div></div>
          </div>
          <button onClick={() => setUser(null)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] text-[#5B6472] hover:text-[#E2665C] hover:bg-[#E2665C]/10 transition-colors mt-1">
            <LogOut size={13} />Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 py-5 md:px-8 md:py-8 overflow-y-auto pb-24 md:pb-8">
        {networkError ? (
          <div className="flex items-center justify-between gap-3 flex-wrap bg-[#E2665C]/10 border border-[#E2665C]/40 rounded-md px-3.5 py-2.5 mb-6">
            <div className="flex items-center gap-2 text-[12px] text-[#E2665C]">
              <AlertCircle size={14} className="flex-shrink-0" />
              Couldn't reach the BCMS server — the data on screen may be out of date.
            </div>
            <button onClick={retry} className="flex items-center gap-1.5 text-[12px] text-[#E2665C] font-medium hover:opacity-80 transition-opacity flex-shrink-0">
              <RefreshCw size={12} />Retry
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 text-[12px] text-[#5B6472] mb-6">
            <Circle size={6} fill={user.live ? "#4FBF8D" : "#C9A227"} stroke="none" />
            {user.live ? "Connected to live BCMS API" : `Preview mode — signed in as ${user.role}`}
          </div>
        )}
        {TabContent}
      </main>

      {/* Mobile bottom tab bar — horizontally scrollable so all 7 sections fit */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#12161D]/95 backdrop-blur border-t border-[#1E2530] flex overflow-x-auto z-20">
        {navItems.map((item) => (
          <button key={item.key} onClick={() => setTab(item.key)}
            className={`flex flex-col items-center gap-1 px-4 py-2.5 flex-shrink-0 min-w-[64px] text-[10px] transition-colors ${
              tab === item.key ? "text-[#E8A94A]" : "text-[#5B6472]"
            }`}>
            <item.icon size={17} />
            {item.label}
          </button>
        ))}
      </nav>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
    </NetworkContext.Provider>
  );
}
