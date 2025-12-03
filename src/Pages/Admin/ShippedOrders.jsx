import React, { useEffect, useState } from 'react';
import { 
  PackageCheck, 
  Trash2, 
  Loader2, 
  Search, 
  ArrowLeft,
  CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Navbar from '../../Components/Navbar/Navbar'; 
import AdminNavbar from '../../Components/Navbar/Adminnavbar';
import Footer from '../../Components/Footer/Footer';

function ShippedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/order/getAllOrders');
      if (response.data.code === "00") {
        // FILTER: Only show "Shipped" orders
        const shippedOnly = response.data.content.filter(o => o.oderStatus === 'Shipped');
        // Sort newest first
        setOrders(shippedOnly.sort((a, b) => b.orderId - a.orderId));
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Delete this shipped order record?")) {
      try {
        const response = await api.delete(`/order/deleteOrder/${orderId}`);
        if (response.data.code === "00") {
          setOrders(prev => prev.filter(order => order.orderId !== orderId));
        } else {
          alert("Failed to delete.");
        }
      } catch (err) { alert("Error deleting."); }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId?.toString().includes(searchTerm)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <div className="hidden md:block"><AdminNavbar /></div>
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          
          <div className="mb-8">
            <button onClick={() => navigate('/oder_details')} className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-4 transition">
                <ArrowLeft size={20} /> Back to Pending Orders
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <PackageCheck className="text-green-600" size={32} /> Shipped History
                    </h1>
                    <p className="text-gray-500 mt-2">Archive of all completed shipments.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search By Name ..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black-500 outline-none w-full md:w-64"
                    />
                </div>
            </div>
          </div>

          {loading ? (
             <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={48} /></div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white-50/50  ">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-black-700 uppercase">Customer</th>
                        <th className="px-6 py-4 text-xs font-bold text-black-700 uppercase">Product</th>
                        <th className="px-6 py-4 text-xs font-bold text-black-700 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-black-700 uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{order.username}</div>
                                <div className="text-xs text-gray-500">{order.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-medium text-gray-800">{order.productName}</span>
                                <div className="text-xs text-gray-500">Qty: {order.quantity} • LKR {order.price}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit bg-green-100 text-green-700 border border-green-200">
                                    <CheckCircle size={12}/> Shipped
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDeleteOrder(order.orderId)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                          </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No shipped history found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ShippedOrders;