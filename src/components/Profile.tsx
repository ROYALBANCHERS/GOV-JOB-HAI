import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Job, CATEGORY_LABELS } from "../types";
import { Link } from "react-router-dom";
import { 
  User as UserIcon, Heart, FileText, 
  Settings, LogOut, ChevronRight, Calendar, MapPin
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'saved' | 'applications'>('saved');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [savedRes, appsRes] = await Promise.all([
        fetch("/api/user/saved-jobs"),
        fetch("/api/user/applications")
      ]);
      setSavedJobs(await savedRes.json());
      setApplications(await appsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (e: React.MouseEvent, jobId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/user/save-job/${jobId}`, { method: "DELETE" });
      if (res.ok) {
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      }
    } catch (err) {
      console.error("Failed to unsave job", err);
    }
  };

  if (!user) return <div className="p-20 text-center">Please login to view your profile</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="mt-2 text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                {user.role}
              </span>
            </div>

            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'saved' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart className="w-4 h-4 mr-3" /> Saved Jobs
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'applications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FileText className="w-4 h-4 mr-3" /> My Applications
              </button>
              <button className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-3" /> Settings
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[600px]">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">
                {activeTab === 'saved' ? 'Saved Job Postings' : 'Application History'}
              </h3>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : activeTab === 'saved' ? (
                <div className="space-y-4">
                  {savedJobs.map(job => (
                    <Link 
                      key={job.id} 
                      to={`/job/${job.id}`}
                      className="block p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{job.title}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</span>
                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {job.job_type}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={(e) => handleUnsave(e, job.id)}
                            className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            title="Unsave Job"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  {savedJobs.length === 0 && (
                    <div className="text-center py-20 text-gray-400">No saved jobs yet</div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app.id} className="p-4 border border-gray-100 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900">{app.job_title}</h4>
                          <p className="text-xs text-gray-500 mt-1">Applied on: {new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase bg-green-50 text-green-600 px-2 py-1 rounded">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="text-center py-20 text-gray-400">No applications yet</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
