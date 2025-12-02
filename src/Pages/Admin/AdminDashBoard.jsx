import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  ArrowRight,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../api/axiosConfig'; 

import Navbar from '../../Components/Navbar/Navbar'; 
import AdminNavbar from '../../Components/Navbar/AdminNavbar'; 
import Footer from '../../Components/Footer/Footer'; 

function AdminDashBoard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalItems: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔍 DEBUG: Starting Dashboard Fetch...");

        // Use allSettled so one failure doesn't crash the whole dashboard
        const results = await Promise.allSettled([
          api.get('/auth/getAllUsers'),
          api.get('/furniture/getAllfurnitures'),
          api.get('/homedeco/getAllHomedeco'),
          api.get('/order/getAllOrders')
        ]);

        // Helper to extract data or default to empty
        const getData = (result, name) => {
          if (result.status === 'fulfilled' && result.value.data.code === "00") {
            console.log(`✅ ${name} Loaded:`, result.value.data.content.length);
            return result.value.data.content;
          } else {
            console.error(`❌ ${name} Failed:`, result.reason || result.value?.data);
            return [];
          }
        };

        const users = getData(results[0], "Users");
        const furniture = getData(results[1], "Furniture");
        const deco = getData(results[2], "Home Deco");
        const orders = getData(results[3], "Orders");

        // Calculate Totals
        const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
        
        // Sort orders by ID desc
        const sortedOrders = [...orders].sort((a, b) => b.orderId - a.orderId).slice(0, 5);

        setStats({
          revenue: totalRevenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalItems: furniture.length + deco.length,
          recentOrders: sortedOrders
        });

      } catch (error) {
        console.error("Critical Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- STAT CARD COMPONENT ---
  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-500 font-medium flex items-center gap-1">
          <TrendingUp size={16} /> +12%
        </span>
        <span className="text-gray-400 ml-2">{subtext}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        <div className="hidden md:block">
            <AdminNavbar />
        </div>

        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-2">Welcome back, Admin. Here's what's happening with your store today.</p>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="animate-spin text-teal-600" size={48} />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* --- METRICS GRID --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Revenue" 
                  value={`LKR ${stats.revenue.toLocaleString()}`} 
                  icon={DollarSign} 
                  color="bg-emerald-500"
                  subtext="vs last month"
                />
                <StatCard 
                  title="Total Orders" 
                  value={stats.totalOrders} 
                  icon={ShoppingBag} 
                  color="bg-blue-500"
                  subtext="New orders placed"
                />
                <StatCard 
                  title="Registered Users" 
                  value={stats.totalUsers} 
                  icon={Users} 
                  color="bg-purple-500"
                  subtext="Active customers"
                />
                <StatCard 
                  title="Total Inventory" 
                  value={stats.totalItems} 
                  icon={Package} 
                  color="bg-amber-500"
                  subtext="Items in stock"
                />
              </div>

              {/* --- CONTENT SECTION --- */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Orders Table (Takes up 2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <Clock size={20} className="text-gray-400" /> Recent Orders
                    </h3>
                    <button className="text-teal-600 text-sm font-semibold hover:text-teal-700">View All</button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.recentOrders.length > 0 ? (
                          stats.recentOrders.map((order) => (
                            <tr key={order.orderId} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4 font-mono text-sm text-gray-500">#{order.orderId}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">{order.productName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{order.username}</td>
                              <td className="px-6 py-4 font-bold text-gray-800">LKR {order.price}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  order.orderStatus === 'SHIPPED' ? 'bg-green-100 text-green-700' : 
                                  order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {order.orderStatus || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-400 italic">No orders yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions (Takes up 1 col) */}
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="font-bold text-xl mb-2">Admin Control</h3>
                  <p className="text-teal-100 text-sm mb-6">Quickly manage your store inventory and settings.</p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/add-item')}
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between transition group"
                    >
                      <span className="font-semibold">Add New Furniture</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    <button 
                      onClick={() => navigate('/add-deco')}
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between transition group"
                    >
                      <span className="font-semibold">Add Home Deco</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    <button 
                      onClick={() => navigate('/userdetails')}
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between transition group"
                    >
                      <span className="font-semibold">Manage Users</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashBoard;