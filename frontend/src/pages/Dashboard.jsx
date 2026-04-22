import { useAuth } from "../context/AuthContext";
import CustomerDashboard from "../components/CustomerDashboard";
import CourierDashboard from "../components/CourierDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        {user?.role === "customer" && <CustomerDashboard />}
        {user?.role === "courier" && <CourierDashboard />}
        {user?.role === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
}
