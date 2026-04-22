import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const [parcels, setParcels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    pickupAddress: "",
    weight: "",
    parcelType: "package",
  });

  const fetchParcels = async () => {
    const { data } = await api.get("/parcels/my");
    setParcels(data);
  };

  useEffect(() => { fetchParcels(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/parcels", form);
      toast.success("Parcel booked!");
      setShowForm(false);
      fetchParcels();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    picked: "bg-blue-100 text-blue-800",
    "in-transit": "bg-indigo-100 text-indigo-800",
    "out-for-delivery": "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-800">My Deliveries</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="btn-primary">
          {showForm ? "Cancel" : "+ Book New Parcel"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl mb-8 grid grid-cols-2 gap-5">
          <h3 className="col-span-2 text-xl font-bold font-display text-slate-800 mb-2">Parcel Details</h3>
          <input placeholder="Receiver Name" className="input-field"
            onChange={(e) => setForm({ ...form, receiverName: e.target.value })} required />
          <input placeholder="Receiver Phone" className="input-field"
            onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })} required />
          <input placeholder="Pickup Address" className="input-field col-span-2"
            onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })} required />
          <input placeholder="Delivery Address" className="input-field col-span-2"
            onChange={(e) => setForm({ ...form, receiverAddress: e.target.value })} required />
          <input type="number" step="0.1" placeholder="Weight (kg)" className="input-field"
            onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
          <div className="relative">
            <select className="input-field appearance-none w-full"
              onChange={(e) => setForm({ ...form, parcelType: e.target.value })}>
              <option value="package">Standard Package</option>
              <option value="document">Document</option>
              <option value="fragile">Fragile Items</option>
              <option value="electronics">Electronics</option>
            </select>
          </div>
          <button className="col-span-2 btn-primary py-3.5 mt-2">
            Calculate Cost & Book
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {parcels.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="font-bold">{p.trackingId}</p>
              <p className="text-sm text-gray-600">To: {p.receiverName}</p>
              <p className="text-sm">{p.receiverAddress}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm ${statusColor[p.status]}`}>
                {p.status}
              </span>
              <p className="mt-2 font-bold">₹{p.cost}</p>
            </div>
          </div>
        ))}
        {parcels.length === 0 && <p className="text-center text-gray-500 py-8">No parcels yet</p>}
      </div>
    </div>
  );
}
