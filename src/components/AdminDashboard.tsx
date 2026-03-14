import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Job, CATEGORY_LABELS } from "../types";
import { 
  BarChart3, Users, Briefcase, FileText, 
  Plus, Edit2, Trash2, CheckCircle, XCircle,
  TrendingUp, Eye, MapPin, Clock, GraduationCap
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "latest_job",
    post_date: "",
    last_date: "",
    short_info: "",
    content: "",
    external_link: "",
    location: "",
    job_type: "Full-time",
    industry: "",
    experience_level: "Entry",
    qualification: "",
    is_filled: 0
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, analyticsRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/admin/analytics")
      ]);
      setJobs(await jobsRes.json());
      setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingJob ? `/api/admin/jobs/${editingJob.id}` : "/api/admin/jobs";
    const method = editingJob ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingJob(null);
        setFormData({
          title: "", category: "latest_job", post_date: "", last_date: "",
          short_info: "", content: "", external_link: "", location: "",
          job_type: "Full-time", industry: "", experience_level: "Entry",
          qualification: "", is_filled: 0
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      category: job.category,
      post_date: job.post_date || "",
      last_date: job.last_date || "",
      short_info: job.short_info || "",
      content: job.content || "",
      external_link: job.external_link || "",
      location: job.location || "",
      job_type: job.job_type || "Full-time",
      industry: job.industry || "",
      experience_level: job.experience_level || "Entry",
      qualification: job.qualification || "",
      is_filled: job.is_filled
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this job?")) {
      await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const toggleFilled = async (job: Job) => {
    await fetch(`/api/admin/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...job, is_filled: job.is_filled ? 0 : 1 }),
    });
    fetchData();
  };

  if (user?.role !== 'admin') return <div className="p-20 text-center">Access Denied</div>;
  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingJob(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center"
        >
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add New Job</>}
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Total Jobs</span>
          </div>
          <p className="text-3xl font-bold">{analytics?.totalJobs?.count || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Total Users</span>
          </div>
          <p className="text-3xl font-bold">{analytics?.totalUsers?.count || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Applications</span>
          </div>
          <p className="text-3xl font-bold">{analytics?.totalApps?.count || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Top Job Views</span>
          </div>
          <p className="text-3xl font-bold">{analytics?.topJobs?.[0]?.views || 0}</p>
        </div>
      </div>

      {isAdding ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-12">
          <h2 className="text-xl font-bold mb-6">{editingJob ? "Edit Job" : "Add New Job Listing"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input 
                required className="w-full p-2 border rounded-lg" 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input 
                className="w-full p-2 border rounded-lg" 
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={formData.job_type} onChange={e => setFormData({...formData, job_type: e.target.value})}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={formData.experience_level} onChange={e => setFormData({...formData, experience_level: e.target.value})}
              >
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input 
                className="w-full p-2 border rounded-lg" 
                value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Qualification</label>
              <input 
                className="w-full p-2 border rounded-lg" 
                value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Date</label>
              <input 
                type="date" className="w-full p-2 border rounded-lg" 
                value={formData.last_date} onChange={e => setFormData({...formData, last_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">External Link</label>
              <input 
                className="w-full p-2 border rounded-lg" 
                value={formData.external_link} onChange={e => setFormData({...formData, external_link: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Short Info</label>
              <textarea 
                className="w-full p-2 border rounded-lg" rows={2}
                value={formData.short_info} onChange={e => setFormData({...formData, short_info: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Full Content (Markdown)</label>
              <textarea 
                required className="w-full p-2 border rounded-lg font-mono text-sm" rows={8}
                value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                {editingJob ? "Update Job Listing" : "Publish Job Listing"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-400 flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" /> {job.location} • <Clock className="w-3 h-3 mx-1" /> {job.job_type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
                      {CATEGORY_LABELS[job.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{job.views}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleFilled(job)}
                      className={`flex items-center text-xs font-bold ${job.is_filled ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {job.is_filled ? <><XCircle className="w-4 h-4 mr-1" /> Filled</> : <><CheckCircle className="w-4 h-4 mr-1" /> Active</>}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleEdit(job)} className="text-blue-500 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
