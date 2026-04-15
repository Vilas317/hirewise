import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dark, setDark] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("applied");
  const [source, setSource] = useState("LinkedIn");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [editingJob, setEditingJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;

  // FETCH
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { res, data } = await apiRequest("jobs");

      if (res.ok) {
        setJobs(data.data?.jobs || []);
      } else {
        toast.error("Failed to fetch jobs");
      }
    } catch {
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // FILTER
  useEffect(() => {
    let temp = [...jobs];

    if (search) {
      temp = temp.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      temp = temp.filter((job) => job.status === filterStatus);
    }

    setFilteredJobs(temp);
    setPage(1);
  }, [search, filterStatus, jobs]);

  // CREATE / UPDATE
  const handleCreateOrUpdate = async () => {
    if (!title || !company) return toast.error("Fill all fields");

    try {
      if (editingJob) {
        await apiRequest(`jobs/${editingJob._id}`, "PUT", {
          title,
          company,
          status,
          source,
        });
        toast.success("Updated");
        setEditingJob(null);
      } else {
        await apiRequest("jobs", "POST", {
          title,
          company,
          status,
          source,
        });
        toast.success("Added");
      }

      setTitle("");
      setCompany("");
      setStatus("applied");
      setSource("LinkedIn");
      setShowModal(false);
      fetchJobs();
    } catch {
      toast.error("Error");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setTitle(job.title);
    setCompany(job.company);
    setStatus(job.status);
    setSource(job.source || "LinkedIn");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    await apiRequest(`jobs/${id}`, "DELETE");
    toast.success("Deleted");
    fetchJobs();
  };

  // PAGINATION
  const start = (page - 1) * limit;
  const paginatedJobs = filteredJobs.slice(start, start + limit);
  const totalPages = Math.ceil(filteredJobs.length / limit);

  // KPI DATA
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === "applied").length;
  const interview = jobs.filter(j => j.status === "interview").length;
  const rejected = jobs.filter(j => j.status === "rejected").length;

  const chartData = [
    { name: "Applied", value: applied },
    { name: "Interview", value: interview },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#3b82f6", "#facc15", "#ef4444"];

  const statusStyle = (status) => {
    if (status === "applied") return "bg-blue-100 text-blue-600";
    if (status === "interview") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-600";
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={dark ? "bg-gray-900 text-white min-h-screen" : "bg-gray-100 min-h-screen"}>
      <Toaster />

      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">HireWise Dashboard</h1>

          <div className="flex gap-2">
            <button onClick={() => setDark(!dark)} className="bg-gray-700 px-3 py-1 rounded text-white">
              🌙
            </button>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded text-white">
              Logout
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <p>Total</p>
            <h2 className="text-xl font-bold">{total}</h2>
          </div>
          <div className="bg-blue-100 p-4 rounded text-center">
            <p>Applied</p>
            <h2 className="font-bold">{applied}</h2>
          </div>
          <div className="bg-yellow-100 p-4 rounded text-center">
            <p>Interview</p>
            <h2 className="font-bold">{interview}</h2>
          </div>
          <div className="bg-red-100 p-4 rounded text-center">
            <p>Rejected</p>
            <h2 className="font-bold">{rejected}</h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={70}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>

          <button onClick={() => setShowModal(true)} className="bg-black text-white px-4 rounded">
            + Add
          </button>
        </div>

        {/* EMPTY STATE */}
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No jobs yet — add your first job 🚀
          </p>
        )}

        {/* JOB LIST */}
        <div className="space-y-4">
          {paginatedJobs.map((job) => (
            <div key={job._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-gray-500">{job.company}</p>
                <p className="text-xs text-gray-400">{job.source}</p>
                <span className={`text-xs px-2 py-1 rounded ${statusStyle(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(job)} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(job._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-300 rounded">
            Prev
          </button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-300 rounded">
            Next
          </button>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-xl font-bold mb-4">
                {editingJob ? "Edit Job" : "Add Job"}
              </h2>

              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 mb-2 w-full"
              />

              <input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border p-2 mb-2 w-full"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 mb-2 w-full"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="border p-2 mb-4 w-full"
              >
                <option>LinkedIn</option>
                <option>Referral</option>
                <option>Careers Page</option>
              </select>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                  Cancel
                </button>

                <button onClick={handleCreateOrUpdate} className="bg-black text-white px-4 py-1 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;