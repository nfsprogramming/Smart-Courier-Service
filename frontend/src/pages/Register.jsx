import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-card p-10 w-full max-w-md animate-slide-up my-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Join our smart courier network</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" placeholder="John Doe" className="input-field"
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" placeholder="john@example.com" className="input-field"
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" placeholder="••••••••" className="input-field"
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="text" placeholder="+1 234 567 890" className="input-field"
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Role</label>
            <select className="input-field appearance-none bg-white/50"
              onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="courier">Courier Driver</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button className="w-full btn-primary py-3.5 mt-4 text-lg">
            Create Account
          </button>
        </form>
        <p className="text-center mt-6 text-slate-600 font-medium">
          Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-500 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
