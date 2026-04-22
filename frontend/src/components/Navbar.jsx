import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <span className="text-2xl font-display font-bold text-slate-800">Smart<span className="text-brand-600">Courier</span></span>
        </Link>
        
        <div className="flex gap-6 items-center font-medium text-slate-600">
          <Link to="/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</Link>
          <Link to="/track" className="hover:text-brand-600 transition-colors">Track</Link>
          
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">{user?.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-semibold uppercase tracking-wider">{user?.role}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
