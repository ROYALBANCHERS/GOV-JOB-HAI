import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import JobDetails from "./components/JobDetails";
import CategoryPage from "./components/CategoryPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import Disclaimer from "./components/Disclaimer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ContactUs from "./components/ContactUs";
import { AuthProvider } from "./AuthContext";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tighter">GOVEMENT JOB HAI</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's #1 portal for government job updates. Stay informed about the latest vacancies, admit cards, and results.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-gray-500">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/category/latest_job" className="hover:text-white transition-colors">Latest Jobs</Link></li>
              <li><Link to="/category/admit_card" className="hover:text-white transition-colors">Admit Cards</Link></li>
              <li><Link to="/category/result" className="hover:text-white transition-colors">Results</Link></li>
              <li><Link to="/category/admission" className="hover:text-white transition-colors">Admission</Link></li>
              <li><Link to="/category/syllabus" className="hover:text-white transition-colors">Syllabus</Link></li>
              <li><Link to="/category/answer_key" className="hover:text-white transition-colors">Answer Key</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-gray-500">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-gray-500">Newsletter</h4>
            <p className="text-xs text-gray-500 mb-4">Subscribe to get latest job alerts in your inbox.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Govement job hai Clone. All rights reserved.</p>
          <p className="mt-2">Designed for educational purposes.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/contact-us" element={<ContactUs />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
