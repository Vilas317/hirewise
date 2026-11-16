import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Activity, ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Menu, MoreHorizontal, Plus, Search, SlidersHorizontal, Sparkles, Target, Trash2, TrendingUp, X, Pencil, Sun, Moon } from "lucide-react";

const STATUSES = ["applied", "interview", "rejected"];
const STATUS_META = {
  applied: { label: "Applied", className: "status-applied", color: "#8a9db5" },
  interview: { label: "Interview", className: "status-interview", color: "#c49a52" },
  rejected: { label: "Rejected", className: "status-rejected", color: "#c77c79" },
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [jobs,setJobs] = useState([]); const [loading,setLoading] = useState(true); const [page,setPage] = useState(1); const [totalPages,setTotalPages] = useState(1);
  const [search,setSearch] = useState(""); const [filterStatus,setFilterStatus] = useState("all"); const [modalOpen,setModalOpen] = useState(false); const [editingJob,setEditingJob] = useState(null); const [saving,setSaving] = useState(false); const [dark,setDark] = useState(false); const [mobileNav,setMobileNav] = useState(false); const [menuFor,setMenuFor] = useState(null);
  const [form,setForm] = useState({title:"",company:"",status:"applied"});

  const fetchJobs = useCallback(async (targetPage = page) => {
    setLoading(true);
    const {res,data} = await apiRequest(`jobs?page=${targetPage}&limit=5`);
    if (res.ok) { setJobs(data.data?.jobs || []); setTotalPages(Math.max(1,data.pagination?.pages || 1)); }
    else if (res.status !== 401) toast.error(data.message || "We couldn't load your applications.");
    setLoading(false);
  },[page]);
  useEffect(()=>{ fetchJobs(page); },[page,fetchJobs]);

  const filteredJobs = useMemo(()=>jobs.filter(job=>{
    const term = search.trim().toLowerCase();
    const matchesText = !term || `${job.title} ${job.company}`.toLowerCase().includes(term);
    return matchesText && (filterStatus === "all" || job.status === filterStatus);
  }),[jobs,search,filterStatus]);

  const counts = useMemo(()=>({
    total: jobs.length,
    applied: jobs.filter(j=>j.status === "applied").length,
    interview: jobs.filter(j=>j.status === "interview").length,
    rejected: jobs.filter(j=>j.status === "rejected").length,
  }),[jobs]);
  const chartData = [{name:"Applied",value:counts.applied,color:"#8a9db5"},{name:"Interview",value:counts.interview,color:"#c49a52"},{name:"Rejected",value:counts.rejected,color:"#c77c79"}];

  const openCreate = () => { setEditingJob(null); setForm({title:"",company:"",status:"applied"}); setModalOpen(true); };
  const openEdit = job => { setEditingJob(job); setForm({title:job.title || "",company:job.company || "",status:job.status || "applied"}); setModalOpen(true); setMenuFor(null); };
  const saveJob = async event => {
    event.preventDefault(); if (!form.title.trim() || !form.company.trim()) return toast.error("Add a role and company first.");
    setSaving(true);
    const endpoint = editingJob ? `jobs/${editingJob._id}` : "jobs";
    const {res,data} = await apiRequest(endpoint,editingJob?"PUT":"POST",{title:form.title.trim(),company:form.company.trim(),status:form.status});
    setSaving(false);
    if (res.ok) { toast.success(editingJob?"Application updated":"Application added"); setModalOpen(false); setEditingJob(null); if (!editingJob && page !== 1) setPage(1); else fetchJobs(page); }
    else toast.error(data.message || "Couldn't save this application.");
  };
  const deleteJob = async job => {
    if (!window.confirm(`Delete the ${job.title} application at ${job.company}?`)) return;
    const {res,data} = await apiRequest(`jobs/${job._id}`,"DELETE");
    if (res.ok) { toast.success("Application deleted"); if (jobs.length === 1 && page > 1) setPage(p=>p-1); else fetchJobs(page); }
    else toast.error(data.message || "Couldn't delete this application.");
    setMenuFor(null);
  };

  const appClass = dark ? "app-shell theme-dark" : "app-shell";
  return <div className={appClass}>
    <Toaster position="top-right" toastOptions={{style:{borderRadius:14,background:dark?"#20242b":"#fff",color:dark?"#f4f2ed":"#24272b"}}}/>
    <aside className={`sidebar ${mobileNav?"sidebar-open":""}`}>
      <div className="sidebar-brand"><span className="brand-mark"><BriefcaseBusiness size={17}/></span><span>hirewise</span><button className="mobile-close" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="side-link active"><LayoutDashboard size={17}/>Overview</button>
      <div className="sidebar-bottom"><div className="sidebar-note"><Sparkles size={16}/><div><strong>One step at a time.</strong><span>Your next opportunity is worth the effort.</span></div></div><button className="side-link" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={17}/>:<Moon size={17}/>} {dark?"Light appearance":"Dark appearance"}</button><button className="side-link" onClick={logout}><LogOut size={17}/>Sign out</button><div className="profile-row"><div className="avatar">H</div><div><strong>Your workspace</strong><span>Personal account</span></div><MoreHorizontal size={18}/></div></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="topbar-right"><span className="today-label"><CalendarDays size={15}/>{new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</span><button className="icon-button" title="Toggle appearance" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button><div className="top-avatar">H</div></div></header>
      <div className="content-wrap">
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR CAREER, IN FOCUS</div><h1>Good things take <em>momentum.</em></h1><p>Keep your search organized. Your next opportunity starts with one small step.</p></div><button className="primary-button add-button" onClick={openCreate}><Plus size={17}/> Add application</button></section>

        <section className="metrics-grid">
          <article className="metric-card metric-featured"><div className="metric-head"><span>Total applications</span><span className="metric-icon"><BriefcaseBusiness size={17}/></span></div><div className="metric-value">{counts.total}<small>on this page</small></div><div className="metric-foot"><span className="metric-trend"><Activity size={13}/> Your search at a glance</span></div></article>
          <article className="metric-card"><div className="metric-head"><span>Applied</span><span className="metric-dot dot-applied"/></div><div className="metric-value">{counts.applied}</div><div className="metric-foot">Applications sent</div></article>
          <article className="metric-card"><div className="metric-head"><span>Interviews</span><span className="metric-dot dot-interview"/></div><div className="metric-value">{counts.interview}</div><div className="metric-foot">Conversations in progress</div></article>
          <article className="metric-card"><div className="metric-head"><span>Not moving forward</span><span className="metric-dot dot-rejected"/></div><div className="metric-value">{counts.rejected}</div><div className="metric-foot">A step closer to the right fit</div></article>
        </section>

        <section className="insights-grid">
          <article className="panel trend-panel"><div className="panel-heading"><div><span className="panel-kicker">YOUR ACTIVITY</span><h2>Application snapshot</h2></div><span className="panel-icon"><TrendingUp size={17}/></span></div><div className="chart-area">{counts.total===0?<div className="chart-empty"><Target size={23}/><span>Add applications to see your activity.</span></div>:<ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:12,right:10,left:-20,bottom:0}}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9aabbd" stopOpacity={0.28}/><stop offset="100%" stopColor="#9aabbd" stopOpacity={0.015}/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="var(--chart-grid)"/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:11}}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:11}}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:12}}/><Area type="monotone" dataKey="value" stroke="#8298ae" strokeWidth={2.5} fill="url(#activityFill)"/></AreaChart></ResponsiveContainer>}</div><div className="chart-caption"><span><i className="legend-line"/> Applications by status</span><span>Current page</span></div></article>
          <article className="panel distribution-panel"><div className="panel-heading"><div><span className="panel-kicker">THE BREAKDOWN</span><h2>Where things stand</h2></div><span className="panel-icon"><SlidersHorizontal size={17}/></span></div><div className="distribution-body"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="88%" paddingAngle={4} stroke="none">{chartData.map((entry,index)=><Cell key={index} fill={entry.color}/>)}</Pie></PieChart></ResponsiveContainer><div className="donut-center"><strong>{counts.total}</strong><span>total</span></div></div><div className="legend-list">{chartData.map(item=><div className="legend-item" key={item.name}><span><i style={{background:item.color}}/>{item.name}</span><strong>{item.value}</strong></div>)}</div></div><div className="distribution-note"><Sparkles size={14}/> Every application is progress.</div></article>
        </section>

        <section className="applications-section"><div className="section-heading"><div><span className="panel-kicker">KEEP IT MOVING</span><h2>Your applications</h2><p>A thoughtful record of every opportunity you pursue.</p></div><div className="application-count">{filteredJobs.length} shown <span>·</span> page {page} of {totalPages}</div></div>
          <div className="table-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search role or company…"/></div><div className="filter-wrap"><SlidersHorizontal size={15}/><select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="all">All statuses</option>{STATUSES.map(s=><option value={s} key={s}>{STATUS_META[s].label}</option>)}</select><ChevronDown size={14}/></div></div>
          <div className="table-card"><div className="table-header"><span>ROLE & COMPANY</span><span>STATUS</span><span>DATE ADDED</span><span/></div>
            {loading?<div className="table-state"><div className="loading-orbit"/><span>Gathering your applications…</span></div>:filteredJobs.length===0?<div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={23}/></div><h3>{search||filterStatus!=="all"?"No matching applications":"Your next opportunity starts here."}</h3><p>{search||filterStatus!=="all"?"Try another search or clear your filters.":"Add the roles you’re interested in and keep every detail in one calm place."}</p>{!search&&filterStatus==="all"&&<button className="secondary-button" onClick={openCreate}><Plus size={16}/> Add your first application</button>}</div>:filteredJobs.map(job=><div className="job-row" key={job._id}><div className="job-identity"><div className="company-avatar">{(job.company||"?").trim().charAt(0).toUpperCase()}</div><div><strong>{job.title}</strong><span><Building2 size={13}/>{job.company}</span></div></div><div><span className={`status-pill ${STATUS_META[job.status]?.className || "status-applied"}`}><i/>{STATUS_META[job.status]?.label || job.status}</span></div><div className="job-date">{formatDate(job.createdAt || job.updatedAt)}</div><div className="row-actions"><button className="row-menu-button" onClick={()=>setMenuFor(menuFor===job._id?null:job._id)} aria-label="Application actions"><MoreHorizontal size={19}/></button>{menuFor===job._id&&<div className="row-menu"><button onClick={()=>openEdit(job)}><Pencil size={14}/> Edit</button><button className="danger-action" onClick={()=>deleteJob(job)}><Trash2 size={14}/> Delete</button></div>}</div></div>)}
          </div>
          <div className="pagination"><span>Showing <strong>{filteredJobs.length}</strong> applications on this page</span><div className="pagination-controls"><button disabled={page===1||loading} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft size={16}/>Previous</button><span>{page} <i>/</i> {totalPages}</span><button disabled={page>=totalPages||loading} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next<ChevronRight size={16}/></button></div></div>
        </section>
        <footer className="dashboard-footer"><span>Made for the next chapter.</span><span>HIREWISE <i>·</i> CAREER TRACKER</span></footer>
      </div>
    </main>

    {modalOpen&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModalOpen(false);}}><section className="job-modal"><div className="modal-top"><div><span className="panel-kicker">{editingJob?"REFINE THE DETAILS":"A NEW OPPORTUNITY"}</span><h2>{editingJob?"Edit application":"Add an application"}</h2><p>Keep the important details close at hand.</p></div><button className="icon-button" onClick={()=>setModalOpen(false)}><X size={18}/></button></div><form onSubmit={saveJob}><label>Role title</label><input autoFocus placeholder="e.g. Product Designer" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/><label>Company</label><input placeholder="e.g. Acme Studio" value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))}/><label>Application status</label><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{STATUSES.map(s=><option value={s} key={s}>{STATUS_META[s].label}</option>)}</select><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving?"Saving…":editingJob?"Save changes":"Add application"}<ArrowUpRight size={16}/></button></div></form></section></div>}
  </div>;
}
