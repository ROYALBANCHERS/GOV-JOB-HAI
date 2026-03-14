import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Job, CATEGORY_LABELS } from "../types";
import { API_BASE } from "../AuthContext";
import {
  ChevronRight, Calendar, ExternalLink, Bell as BellIcon,
  Search, Filter, MapPin, Briefcase, GraduationCap, Clock
} from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, []);

  const fetchJobs = async (queryStr = "") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/jobs${queryStr}`, {
        headers: {
          'Accept': 'application/json',
        }
      });
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
    fetchJobs(`?${params.toString()}`);
  };

  const handleApplyNow = async (jobId: number, externalLink: string | null) => {
    // If there's an external link, redirect directly to the government portal
    if (externalLink) {
      window.open(externalLink, '_blank');
    } else {
      // If no external link, go to job details page
      navigate(`/job/${jobId}`);
    }
  };

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
  }, []);

  const fetchJobs = async (queryStr = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs${queryStr}`);
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
    fetchJobs(`?${params.toString()}`);
  };

  const getJobsByCategory = (category: string) => {
    return jobs.filter((job) => job.category === category).slice(0, 8);
  };

  const categories = [
    { id: "result", label: "Result", color: "bg-red-50" },
    { id: "admit_card", label: "Admit Card", color: "bg-blue-50" },
    { id: "latest_job", label: "Latest Job", color: "bg-green-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search & Filter Bar */}
      <div className="max-w-3xl mx-auto bg-white p-3 md:p-4 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search jobs..."
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
              Search
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

      {/* Hero / Marquee Section */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-8">
        <div className="flex items-center space-x-2 text-yellow-800 font-bold mb-2">
          <BellIcon className="w-5 h-5 animate-bounce" />
          <span>LATEST UPDATES</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee hover:pause cursor-default">
            {jobs.slice(0, 5).map((job) => (
              <Link 
                key={job.id} 
                to={`/job/${job.id}`}
                className="mx-4 text-blue-700 hover:underline font-medium"
              >
                • {job.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004a99]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm ${cat.color}`}
            >
              <div className="bg-[#004a99] text-white px-4 py-3 flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-wider">{cat.label}</h2>
                <Link to={`/category/${cat.id}`} className="text-xs hover:underline flex items-center">
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <div className="p-2">
                <ul className="divide-y divide-gray-200">
                  {getJobsByCategory(cat.id).map((job) => (
                    <li key={job.id} className="py-3 px-2 hover:bg-white/50 transition-colors">
                      <Link to={`/job/${job.id}`} className="flex flex-col">
                        <span className="text-sm font-semibold text-blue-800 hover:text-red-600 leading-tight">
                          {job.title}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            {job.last_date && (
                              <span className="text-[10px] text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Last Date: {job.last_date}
                              </span>
                            )}
                            {job.location && (
                              <span className="text-[10px] text-gray-400 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {job.location}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleApplyNow(job.id, job.external_link);
                            }}
                            className="text-[10px] font-bold text-blue-600 border border-blue-600 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1"
                          >
                            Apply <ExternalLink className="w-2 h-2" />
                          </button>
                        </div>
                      </Link>
                    </li>
                  ))}
                  {getJobsByCategory(cat.id).length === 0 && (
                    <li className="py-8 text-center text-gray-400 text-sm italic">
                      No updates available
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Secondary Categories */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {['answer_key', 'syllabus', 'admission', 'important'].map((catId) => (
          <Link 
            key={catId}
            to={`/category/${catId}`}
            className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center group"
          >
            <h3 className="text-sm font-bold text-gray-700 group-hover:text-blue-700 uppercase">
              {CATEGORY_LABELS[catId]}
            </h3>
          </Link>
        ))}
      </div>

      {/* About Section */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Govement job hai</h2>
        <p className="text-gray-600 leading-relaxed text-sm">
          Govement job hai is the most trusted portal for government job seekers in India. We provide timely updates on the latest government jobs, admit cards, exam results, answer keys, and admission notifications. Our goal is to simplify the job search process for millions of aspirants across the country.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            <ExternalLink className="w-3 h-3 mr-1" />
            Official Website
          </div>
          <div className="flex items-center text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            <Calendar className="w-3 h-3 mr-1" />
            Daily Updates
          </div>
        </div>
      </div>
    </div>
  );
}
