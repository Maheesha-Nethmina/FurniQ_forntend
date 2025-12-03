import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Trash2, 
  Loader2, 
  Search, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  Truck, 
  CheckCircle,
  History // <--- Imported History Icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- Imported useNavigate

import api from '../../api/axiosConfig';

import Navbar from '../../Components/Navbar/Navbar'; 
import AdminNavbar from '../../Components/Navbar/Adminnavbar';
import Footer from '../../Components/Footer/Footer';

function OderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Sort: Newest IDs first
  const sortOrders = (data) => {
    return data.sort((a, b) => b.orderId - a.orderId);
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/order/getAllOrders');
      
      if (response.data.code === "00") {
        // Only show "To Be Ship" orders 
        const pendingOrders = response.data.content.filter(o => o.oderStatus === 'To Be Ship');
        const sorted = sortOrders(pendingOrders);
        setOrders(sorted);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Mark as Shipped
  const handleMarkAsShipped = async (orderId) => {
    if (window.confirm("Mark as SHIPPED? This will move the order to the History page.")) {
      try {
        const response = await api.put(`/order/markAsShipped/${orderId}`);
        
        if (response.data.code === "00") {
          alert("Order updated successfully!");
          
          // Remove from this list immediately (it moves to history)
          setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
          
        } else {
          alert("Failed to update order status.");
        }
      } catch (err) {
        console.error(err);
        alert("Error occurred while updating.");
      }
    }
  };

  // Handle Delete
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        const response = await api.delete(`/order/deleteOrder/${orderId}`);
        
        if (response.data.code === "00") {
          alert("Order deleted successfully!");
          setOrders(prev => prev.filter(order => order.orderId !== orderId));
        } else {
          alert("Failed to delete order.");
        }
      } catch (err) {
        console.error(err);
        alert("Error occurred while deleting.");
      }
    }
  };

  // Stats Calculations (Based on current active list)
  const totalOrders = orders.length;
  // Since we filtered for 'To Be Ship', everything here is pending
  const pendingCount = orders.length; 
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.price || 0), 0);

  // Filter Logic (Search)
  const filteredOrders = orders.filter(order => 
    order.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId?.toString().includes(searchTerm)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-1 pt-16">
        <div className="hidden md:block">
            <AdminNavbar />
        </div>

        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-500 mt-2">Track shipments, revenue, and manage customer orders.</p>
            </div>
            
            <div className="flex gap-3">
                {/* --- NEW BUTTON: View History --- */}
                <button 
                    onClick={() => navigate('/shipped-orders')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm"
                >
                    <History size={18} /> <span className="hidden sm:inline">Shipped History</span>
                </button>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search Customer..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-64"
                    />
                </div>
            </div>
          </div>

          {/* Stats Cards - Preserved original 3-column Grid Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-full">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Active Orders</p>
                        <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Pending Shipment</p>
                        <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Active Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900">LKR {totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>
            </div>
          </div>

          {/* --- ORDER TABLE --- */}
          {loading ? (
             <div className="h-64 flex items-center justify-center">
               <Loader2 className="animate-spin text-teal-600" size={48} />
             </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle size={20} /> {error}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        {/* <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ID</th> */}
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Details</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-gray-50 transition">
                            
                            {/* Customer */}
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{order.username}</div>
                                <div className="text-xs text-gray-500">{order.email}</div>
                                <div className="text-xs text-gray-400">{order.mobileNumber}</div>
                            </td>

                            {/* Product */}
                            <td className="px-6 py-4">
                                <span className="font-medium text-gray-800">{order.productName}</span>
                                <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
                                    {order.oderType}
                                </div>
                            </td>

                            {/* Price & Qty */}
                            <td className="px-6 py-4">
                                <div className="text-sm font-bold text-teal-700">LKR {order.price}</div>
                                <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                            </td>

                            {/* Status Badge */}
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                                    order.oderStatus === 'To Be Ship' 
                                    ? 'bg-white text-blue-600 border border-blue-100' 
                                    : 'bg-white text-green-600 border border-green-100'
                                }`}>
                                    {order.oderStatus === 'Shipped' && <CheckCircle size={12}/>}
                                    {order.oderStatus}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    
                                    {/* Action 1: Mark as Shipped (Only if Pending) */}
                                    {order.oderStatus === 'To Be Ship' && (
                                        <button 
                                            onClick={() => handleMarkAsShipped(order.orderId)}
                                            className="p-2 text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition shadow-sm flex items-center gap-2"
                                            title="Mark as Shipped"
                                        >
                                            <Truck size={16} /> 
                                            <span className="text-xs font-bold hidden xl:inline">Ship</span>
                                        </button>
                                    )}

                                    {/* Action 2: Delete Order */}
                                    <button 
                                        onClick={() => handleDeleteOrder(order.orderId)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
                                        title="Delete Order"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                No active orders found.
                            </td>
                        </tr>
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

export default OderDetails;