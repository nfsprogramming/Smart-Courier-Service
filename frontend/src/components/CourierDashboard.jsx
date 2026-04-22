import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function CourierDashboard() {
  const [myParcels, setMyParcels] = useState([]);
  const [availableParcels, setAvailableParcels] = useState([]);

  const fetchData = async () => {
    try {
      const res1 = await api.get("/parcels/courier");
      setMyParcels(res1.data);
      const res2 = await api.get("/parcels/unassigned");
      setAvailableParcels(res2.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/parcels/${id}/status`, { status, location: "Local Hub" });
      toast.success("Status updated");
      fetchData();
    } catch {
      toast.error("Update failed");
    }
  };

  const acceptParcel = async (id) => {
    try {
      await api.put(`/parcels/${id}/accept`);
      toast.success("Parcel accepted!");
      fetchData();
    } catch {
      toast.error("Failed to accept parcel");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold text-slate-900">My Active Deliveries</h1>
          <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold">
            {myParcels.length} Active
          </span>
        </div>
        <div className="grid gap-4">
          {myParcels.map((p) => (
            <div key={p._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-slate-900">{p.trackingId}</span>
                  <span className="status-badge bg-blue-100 text-blue-700">{p.status}</span>
                </div>
                <p className="text-slate-600 font-medium">To: {p.receiverName}</p>
                <p className="text-sm text-slate-500">{p.receiverAddress}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => updateStatus(p._id, "picked")} className="btn-secondary text-xs py-2">Picked</button>
                <button onClick={() => updateStatus(p._id, "in-transit")} className="btn-secondary text-xs py-2">In Transit</button>
                <button onClick={() => updateStatus(p._id, "out-for-delivery")} className="btn-secondary text-xs py-2">Out for Delivery</button>
                <button onClick={() => updateStatus(p._id, "delivered")} className="btn-primary text-xs py-2">Delivered</button>
              </div>
            </div>
          ))}
          {myParcels.length === 0 && (
            <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No active deliveries assigned to you.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-slate-900">Available Jobs</h2>
          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
            {availableParcels.length} New Requests
          </span>
        </div>
        <div className="grid gap-4">
          {availableParcels.map((p) => (
            <div key={p._id} className="glass-card p-6 border-l-4 border-amber-400 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-slate-900">{p.trackingId}</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Pending</span>
                </div>
                <p className="text-slate-600 font-medium">Pickup: {p.pickupAddress}</p>
                <p className="text-sm text-slate-500">To: {p.receiverAddress}</p>
              </div>
              <button onClick={() => acceptParcel(p._id)} className="btn-primary px-8">
                Accept Job
              </button>
            </div>
          ))}
          {availableParcels.length === 0 && (
            <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No new parcels available for pickup right now.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
