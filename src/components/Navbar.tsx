import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Bell, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-[#004a99] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tighter">GOVEMENT JOB HAI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 text-[11px] font-bold uppercase tracking-wider">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/category/latest_job" className="hover:text-yellow-400 transition-colors">Latest Job</Link>
            <Link to="/category/result" className="hover:text-yellow-400 transition-colors">Result</Link>
            <Link to="/category/admit_card" className="hover:text-yellow-400 transition-colors">Admit Card</Link>
            <Link to="/category/admission" className="hover:text-yellow-400 transition-colors">Admission</Link>
            <Link to="/category/syllabus" className="hover:text-yellow-400 transition-colors">Syllabus</Link>
            <Link to="/category/answer_key" className="hover:text-yellow-400 transition-colors">Answer Key</Link>
            <div className="relative group">
              <button className="hover:text-yellow-400 transition-colors flex items-center">
                More <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                <Link to="/category/important" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Important</Link>
                <Link to="/category/certificate_verification" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Verification</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link to="/contact-us" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Contact Us</Link>
                <Link to="/disclaimer" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Disclaimer</Link>
              </div>
            </div>
          </div>

          {/* Search & User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="p-2 hover:bg-white/10 rounded-full" title="Admin Dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <Link to="/profile" className="flex items-center space-x-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-xs font-bold hidden lg:inline">{user.name}</span>
                </Link>
                <button 
                  onClick={() => { logout(); navigate("/"); }}
                  className="p-2 hover:bg-red-500/20 rounded-full text-red-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="text-xs font-bold uppercase hover:text-yellow-400">Login</Link>
                <span className="text-white/30">|</span>
                <Link to="/register" className="text-xs font-bold uppercase hover:text-yellow-400">Register</Link>
              </div>
            )}
            
            <button 
              className="md:hidden p-2 hover:bg-white/10 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#003d7a] border-t border-white/10 py-4 px-4 space-y-3">
          <Link to="/" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/category/latest_job" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Latest Job</Link>
          <Link to="/category/result" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Result</Link>
          <Link to="/category/admit_card" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Admit Card</Link>
          <Link to="/category/admission" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Admission</Link>
          <Link to="/category/syllabus" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Syllabus</Link>
          <Link to="/category/answer_key" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Answer Key</Link>
          <Link to="/contact-us" className="block text-xs font-bold uppercase tracking-wide hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          {!user && (
            <div className="pt-2 border-t border-white/10 flex space-x-4">
              <Link to="/login" className="text-xs font-bold uppercase hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-xs font-bold uppercase hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
