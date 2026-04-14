import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";

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
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("applied");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [editingJob, setEditingJob] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ✅ FETCH JOBS
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { res, data } = await apiRequest("jobs");

      console.log("Jobs API response:", data);

      if (res.ok) {
        setJobs(data.jobs || []);
      } else {
        showToast(data.message || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error(err);
      showToast("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ FILTERING
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

  // ✅ CREATE / UPDATE
  const handleCreateOrUpdate = async () => {
    if (!title.trim() || !company.trim()) {
      showToast("Fill all fields");
      return;
    }

    try {
      let res;

      if (editingJob) {
        ({ res } = await apiRequest(`jobs/${editingJob._id}`, "PUT", {
          title,
          company,
          status,
        }));

        if (res.ok) {
          showToast("Updated");
          setEditingJob(null);
        } else {
          showToast("Update failed");
        }
      } else {
        ({ res } = await apiRequest("jobs", "POST", {
          title,
          company,
          status,
        }));

        if (res.ok) {
          showToast("Added");
        } else {
          showToast("Add failed");
        }
      }

      setTitle("");
      setCompany("");
      setStatus("applied");

      fetchJobs();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong");
    }
  };

  // ✅ EDIT
  const handleEdit = (job) => {
    setEditingJob(job);
    setTitle(job.title);
    setCompany(job.company);
    setStatus(job.status);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      const { res } = await apiRequest(`jobs/${id}`, "DELETE");

      if (res.ok) {
        showToast("Deleted");
        fetchJobs();
      } else {
        showToast("Delete failed");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting job");
    }
  };

  // PAGINATION
  const start = (page - 1) * limit;
  const paginatedJobs = filteredJobs.slice(start, start + limit);
  const totalPages = Math.ceil(filteredJobs.length / limit);

  // CHART DATA
  const applied = jobs.filter((j) => j.status === "applied").length;
  const interview = jobs.filter((j) => j.status === "interview").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;

  const chartData = [
    { name: "Applied", value: applied },
    { name: "Interview", value: interview },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#3b82f6", "#facc15", "#ef4444"];

  const statusStyle = (status) => {
    if (status === "applied") return "bg-blue-500 text-white";
    if (status === "interview") return "bg-yellow-400 text-black";
    return "bg-red-500 text-white";
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className={dark ? "bg-gray-900 text-white min-h-screen" : ""}>
      <div className="max-w-5xl mx-auto p-6">

        {toast && (
          <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">HireWise Dashboard</h1>

          <div className="flex gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="bg-gray-700 text-white px-3 py-1 rounded"
            >
              Toggle
            </button>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Search..."
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
        </div>

        {/* ADD */}
        <div className="flex gap-2 mb-6">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={handleCreateOrUpdate}
            className="bg-black text-white px-4 rounded"
          >
            {editingJob ? "Update" : "Add"}
          </button>
        </div>

        {/* JOB LIST */}
        <div className="space-y-4">
          {paginatedJobs.length === 0 ? (
            <p>No jobs found</p>
          ) : (
            paginatedJobs.map((job) => (
              <div
                key={job._id}
                className="p-4 border rounded flex justify-between items-center shadow"
              >
                <div>
                  <h3 className="font-bold">{job.title}</h3>
                  <p>{job.company}</p>

                  <span className={`px-2 py-1 text-xs rounded ${statusStyle(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(job)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;