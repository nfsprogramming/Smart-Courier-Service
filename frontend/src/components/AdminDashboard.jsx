import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [parcels, setParcels] = useState([]);
  const [couriers, setCouriers] = useState([]);

  const fetchData = async () => {
    const [p, c] = await Promise.all([
      api.get("/parcels"),
      api.get("/users/couriers"),
    ]);
    setParcels(p.data);
    setCouriers(c.data);
  };

  useEffect(() => { fetchData(); }, []);

  const assignCourier = async (parcelId, courierId) => {
    try {
      await api.put(`/parcels/${parcelId}/assign`, { courierId });
      toast.success("Courier assigned");
      fetchData();
    } catch {
      toast.error("Assignment failed");
    }
  };

  const stats = {
    total: parcels.length,
    pending: parcels.filter(p => p.status === "pending").length,
    delivered: parcels.filter(p => p.status === "delivered").length,
    revenue: parcels.reduce((sum, p) => sum + p.cost, 0),
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-slate-800 mb-8">Admin Operations</h1>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Total Parcels</p>
          <p className="text-3xl font-display font-bold text-slate-800 mt-2">{stats.total}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-yellow-500">
          <p className="text-sm font-medium text-slate-500">Pending Assignment</p>
          <p className="text-3xl font-display font-bold text-slate-800 mt-2">{stats.pending}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-brand-500">
          <p className="text-sm font-medium text-slate-500">Delivered Successfully</p>
          <p className="text-3xl font-display font-bold text-slate-800 mt-2">{stats.delivered}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500">
          <p className="text-sm font-medium text-slate-500">Total Revenue</p>
          <p className="text-3xl font-display font-bold text-slate-800 mt-2">₹{stats.revenue}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-medium text-slate-500">Tracking ID</th>
              <th className="p-4 font-medium text-slate-500">Sender</th>
              <th className="p-4 font-medium text-slate-500">Receiver</th>
              <th className="p-4 font-medium text-slate-500">Status</th>
              <th className="p-4 font-medium text-slate-500">Cost</th>
              <th className="p-4 font-medium text-slate-500">Assign Courier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {parcels.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono text-sm text-brand-600 font-medium">{p.trackingId}</td>
                <td className="p-4 text-slate-700">{p.sender?.name}</td>
                <td className="p-4 text-slate-700">{p.receiverName}</td>
                <td className="p-4"><span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">{p.status}</span></td>
                <td className="p-4 font-medium text-slate-800">₹{p.cost}</td>
                <td className="p-4">
                  <select
                    className="input-field py-2 text-sm max-w-[150px]"
                    value={p.assignedCourier?._id || ""}
                    onChange={(e) => assignCourier(p._id, e.target.value)}
                  >
                    <option value="">Assign Driver</option>
                    {couriers.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
