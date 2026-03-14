import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Job, CATEGORY_LABELS } from "../types";
import Markdown from "react-markdown";
import {
  Calendar, ArrowLeft, Share2, Printer,
  Download, Heart, CheckCircle2, MapPin, Briefcase, GraduationCap, ExternalLink
} from "lucide-react";
import { useAuth, API_BASE } from "../AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/jobs/${id}`, {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleSave = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await fetch(`${API_BASE}/save-job/${id}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setIsSaved(true);
        setMessage("Job saved successfully!");
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to save job");
      }
    } catch (err) {
      setMessage("An error occurred");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleApply = async () => {
    // If there's an external link, redirect to government portal directly
    if (job?.external_link) {
      window.open(job.external_link, '_blank');
      setIsApplied(true);
      setMessage("Redirecting to official government portal...");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // If no external link, use the backend apply endpoint
    if (!user) return navigate("/login");
    try {
      const res = await fetch(`${API_BASE}/apply/${id}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setIsApplied(true);
        if (data.external_link) {
          // If backend returns an external link, redirect there
          window.open(data.external_link, '_blank');
          setMessage("Redirecting to official government portal...");
        } else {
          setMessage("Application submitted successfully!");
        }
      } else {
        setMessage(data.message || "Failed to apply");
      }
    } catch (err) {
      setMessage("An error occurred");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004a99]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
        <p className="text-gray-500 mt-2">The job notification you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
      </Link>

      {message && (
        <div className="bg-blue-600 text-white p-4 rounded-xl mb-6 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-4">
          <span className="font-medium">{message}</span>
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
              {CATEGORY_LABELS[job.category]}
            </span>
            {job.last_date && (
              <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> Last Date: {job.last_date}
              </span>
            )}
            {job.is_filled && (
              <span className="bg-gray-200 text-gray-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                Position Filled
              </span>
            )}
            {job.external_link && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" /> External Apply
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {job.title}
          </h1>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              <span>{job.location || "N/A"}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
              <span>{job.job_type || "N/A"}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
              <span>{job.qualification || "N/A"}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span>{job.experience_level || "N/A"}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Posted on: {new Date(job.created_at || '').toLocaleDateString()}</span>
              <span>•</span>
              <div className="flex items-center space-x-2">
                <button className="hover:text-blue-600 flex items-center">
                  <Share2 className="w-3 h-3 mr-1" /> Share
                </button>
                <button className="hover:text-blue-600 flex items-center" onClick={() => window.print()}>
                  <Printer className="w-3 h-3 mr-1" /> Print
                </button>
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`p-2 rounded-full border transition-colors ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="prose prose-blue max-w-none">
            <div className="markdown-body">
              <Markdown>{job.content || ""}</Markdown>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleApply}
              disabled={isApplied || job.is_filled}
              className={`flex items-center justify-center font-bold py-4 px-6 rounded-xl transition-colors shadow-lg ${isApplied ? 'bg-green-100 text-green-700 cursor-default' : 'bg-[#004a99] text-white hover:bg-[#003d7a] shadow-blue-900/20'}`}
            >
              {isApplied ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Applied</> : (job.external_link ? <><ExternalLink className="w-5 h-5 mr-2" /> Apply on Official Portal</> : "Apply Online Now")}
            </button>
            {job.external_link && (
              <button
                onClick={() => window.open(job.external_link, '_blank')}
                className="flex items-center justify-center bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-colors border border-green-700"
              >
                <ExternalLink className="w-5 h-5 mr-2" /> Visit Official Website
              </button>
            )}
            <button className="flex items-center justify-center bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200">
              <Download className="w-5 h-5 mr-2" /> Download Notification
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-yellow-50 p-6 border-t border-yellow-100">
          <h3 className="font-bold text-yellow-800 mb-2">Important Note:</h3>
          <p className="text-sm text-yellow-700 leading-relaxed">
            {job.external_link
              ? `This job will redirect you to the official government portal. Please read the official notification carefully before applying. Ensure you meet all eligibility criteria including age limit, educational qualification, and category-specific requirements.`
              : "Please read the official notification carefully before applying. Ensure you meet all eligibility criteria including age limit, educational qualification, and category-specific requirements."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
