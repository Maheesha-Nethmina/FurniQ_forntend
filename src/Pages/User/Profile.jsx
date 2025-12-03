import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import { 
  Mail, Package, ChevronRight, ShoppingBag, LogOut, Phone 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get ID from local storage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;

      try {
        const response = await api.get(`/order/getOrdersByUserId/${userId}`);
        if (response.data.code === "00") {
          setOrders(response.data.content);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Helper function to style status badges
  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase() || "";
    if (normalizedStatus.includes("ship") && !normalizedStatus.includes("shipped")) {
      // To Be Ship - Teal/Greenish
      return "bg-teal-50 text-teal-700 border-teal-200";
    }
    if (normalizedStatus.includes("shipped") || normalizedStatus.includes("delivered") || normalizedStatus.includes("complete")) {
      // Completed - Dark/Navy
      return "bg-slate-100 text-slate-700 border-slate-200";
    }
    if (normalizedStatus.includes("cancel")) {
      // Cancelled - Red
      return "bg-red-50 text-red-600 border-red-200";
    }
    // Default - Gray
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- left column, user details --- */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-28">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-3xl font-bold text-teal-600 mb-4 ring-4 ring-white shadow-sm">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{user?.username}</h2>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-teal-50 rounded-lg shrink-0 mr-4">
                        <Mail className="text-teal-600 w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-0.5">Email</p>
                      <p className="text-sm font-medium truncate text-gray-700">{user?.email}</p>
                    </div>
                  </div>
                  

                  <div className="flex items-start">
                     <div className="p-2 bg-teal-50 rounded-lg shrink-0 mr-4">
                        <Package className="text-teal-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-0.5">Total Orders</p>
                      <p className="text-sm font-medium text-gray-700">{orders.length} Orders</p>
                    </div>
                  </div>
                </div>

              
              </div>
            </div>

            {/*oder details  */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                Order History
              </h1>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-gray-50 rounded-2xl animate-pulse border border-gray-100"></div>
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.slice().reverse().map((order) => (
                    <div 
                      key={order.orderId} 
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-6 border-b border-gray-100">
                        
                        <div className={`mt-2 md:mt-0 px-4 py-1.5 rounded-full text-xs font-bold border w-fit uppercase tracking-wide ${getStatusStyle(order.oderStatus)}`}>
                          {order.oderStatus}
                        </div>
                      </div>

                      <div className="flex items-start gap-6">
                       
                        <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-teal-50 transition">
                           <Package className="w-8 h-8 text-gray-300 group-hover:text-teal-500 transition" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition mb-2">
                            {order.productName}
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 font-medium">Price:</span>
                              <span className="font-bold text-teal-600">LKR {order.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 font-medium">Quantity:</span>
                              <span className="font-bold text-gray-700">{order.quantity}</span>
                            </div>
                             <div className="flex items-center gap-2">
                              <span className="text-gray-400 font-medium">Mobile:</span>
                              <span className="font-bold text-gray-700">{order.mobileNumber || "N/A"}</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 flex items-start gap-2">
                              <span className="text-gray-400 font-medium shrink-0">Address:</span>
                              <span className="text-gray-700 font-medium truncate">{order.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
                  <p className="text-gray-500 mt-2 mb-8 max-w-sm">It looks like you haven't placed any orders yet.</p>
                  <button 
                    onClick={() => navigate('/furniture')}
                    className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition shadow-lg shadow-teal-100 flex items-center gap-2"
                  >
                    Start Shopping <ChevronRight size={18}/>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;