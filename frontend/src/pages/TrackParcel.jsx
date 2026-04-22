import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function TrackParcel() {
  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.get(`/parcels/track/${trackingId}`);
      setParcel(data);
    } catch {
      setError("Parcel not found");
      setParcel(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📍 Track Your Parcel</h1>
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            className="flex-1 p-3 border rounded-lg"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 rounded-lg">Track</button>
        </form>

        {error && <p className="text-red-600">{error}</p>}

        {parcel && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Tracking: {parcel.trackingId}</h2>
            <p><strong>Status:</strong> <span className="px-3 py-1 bg-blue-100 rounded-full">{parcel.status}</span></p>
            <p><strong>Receiver:</strong> {parcel.receiverName}</p>
            <p><strong>Address:</strong> {parcel.receiverAddress}</p>
            <p><strong>Estimated Delivery:</strong> {new Date(parcel.estimatedDelivery).toLocaleDateString()}</p>

            <h3 className="mt-6 font-bold">Tracking History</h3>
            <ul className="mt-2 space-y-2">
              {parcel.trackingHistory.map((h, i) => (
                <li key={i} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
                  <p className="font-semibold capitalize">{h.status}</p>
                  <p className="text-sm text-gray-600">{h.location}</p>
                  <p className="text-xs text-gray-400">{new Date(h.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
