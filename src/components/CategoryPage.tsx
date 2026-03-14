import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Job, CATEGORY_LABELS } from "../types";
import { 
  Calendar, ChevronRight, Search, Filter, 
  MapPin, Clock, Briefcase, GraduationCap 
} from "lucide-react";
import { motion } from "motion/react";

export default function CategoryPage() {
  const { category } = useParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    qualification: ""
  });

  useEffect(() => {
    fetchJobs();
  }, [category]);

  const fetchJobs = async (queryStr = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams(queryStr);
      if (category) params.append("category", category);
      
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    fetchJobs(params.toString());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
          {CATEGORY_LABELS[category || ""] || "Job Updates"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse all latest {CATEGORY_LABELS[category || ""]?.toLowerCase()} notifications.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-3xl mx-auto bg-white p-3 md:p-4 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search within this category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 focus:bg-white transition-all text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="button"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center ${isFilterExpanded ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'}`}
              title="Toggle Filters"
            >
              <Filter className={`w-4 h-4 ${isFilterExpanded ? 'fill-current' : ''}`} />
            </button>
            <button type="submit" className="hidden md:block bg-[#004a99] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#003d7a] transition-all shadow-lg shadow-blue-900/10 active:scale-95">
              Filter
            </button>
          </div>

          <motion.div 
            initial={false}
            animate={{ height: isFilterExpanded ? "auto" : 0, opacity: isFilterExpanded ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 mt-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}
                >
                  <option value="">All Locations</option>
                  <option value="All India">All India</option>
                  <option value="Delhi">Delhi</option>
                  <option value="UP">Uttar Pradesh</option>
                </select>
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={filters.qualification} onChange={e => setFilters({...filters, qualification: e.target.value})}
                >
                  <option value="">All Qualifications</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    setFilters({location: "", industry: "", qualification: ""});
                    setSearchQuery("");
                    fetchJobs();
                  }}
                  className="flex-1 text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors"
                >
                  Reset
                </button>
                <button type="submit" className="md:hidden flex-1 bg-[#004a99] text-white py-2.5 rounded-xl font-bold">
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {jobs.length} Notifications Found
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Link 
                  to={`/job/${job.id}`}
                  className="block p-6 hover:bg-blue-50/30 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {job.short_info}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" /> Posted: {new Date(job.created_at).toLocaleDateString()}
                          </span>
                          {job.last_date && (
                            <span className="flex items-center text-red-500 font-medium">
                              <Calendar className="w-3 h-3 mr-1" /> Last Date: {job.last_date}
                            </span>
                          )}
                          {job.location && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" /> {job.location}
                            </span>
                          )}
                          {job.job_type && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {job.job_type}
                            </span>
                          )}
                        </div>
                        <span className="bg-[#004a99] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#003d7a] transition-colors">
                          Apply Now
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 ml-4 flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}

          {!loading && jobs.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 italic">No notifications found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
