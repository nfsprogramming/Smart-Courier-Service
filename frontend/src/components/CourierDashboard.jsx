import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function CourierDashboard() {
  const [parcels, setParcels] = useState([]);

  const fetchParcels = async () => {
    const { data } = await api.get("/parcels/courier");
    setParcels(data);
  };

  useEffect(() => { fetchParcels(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/parcels/${id}/status`, { status, location: "Hub" });
      toast.success("Status updated");
      fetchParcels();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Deliveries</h1>
      <div className="grid gap-4">
        {parcels.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{p.trackingId}</p>
                <p className="text-sm">To: {p.receiverName} ({p.receiverPhone})</p>
                <p className="text-sm text-gray-600">{p.receiverAddress}</p>
              </div>
              <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">{p.status}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => updateStatus(p._id, "picked")}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Picked</button>
              <button onClick={() => updateStatus(p._id, "in-transit")}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm">In Transit</button>
              <button onClick={() => updateStatus(p._id, "out-for-delivery")}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm">Out for Delivery</button>
              <button onClick={() => updateStatus(p._id, "delivered")}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm">Delivered</button>
            </div>
          </div>
        ))}
        {parcels.length === 0 && <p className="text-center text-gray-500 py-8">No assignments yet</p>}
      </div>
    </div>
  );
}
