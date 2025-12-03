import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import api from '../../api/axiosConfig';
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const fetchCart = async () => {
    if (!userId) return;
    try {
        const response = await api.get(`/cart/get/${userId}`);
        if (response.data.code === "00") {
            setCartItems(response.data.content);
        }
    } catch (error) {
        console.error("Error loading cart", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if(!userId) {
        alert("Please login to view cart");
        navigate("/login");
    } else {
        fetchCart();
    }
  }, [userId]);

  const handleRemove = async (cartId) => {
    if(!window.confirm("Remove this item?")) return;
    try {
        const res = await api.delete(`/cart/remove/${cartId}`);
        if(res.data.code === "00") {
            fetchCart(); // Refresh list
        }
    } catch (err) {
        alert("Error removing item");
    }
  };

  // Calculate Total
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 w-full flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <ShoppingBag className="text-teal-600" /> Your Shopping Cart
        </h1>

        {loading ? (
            <div className="flex justify-center h-64 items-center">
                <Loader2 className="animate-spin text-teal-600" size={48} />
            </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
            <button onClick={() => navigate('/furniture')} className="mt-6 bg-teal-600 text-white px-8 py-3 rounded-xl font-bold">
                Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items List */}
            <div className="flex-1 space-y-4">
                {cartItems.map((item) => (
                    <div key={item.cartId} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover rounded-xl bg-gray-100" />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{item.productName}</h3>
                            <p className="text-sm text-gray-500">{item.productType} | Qty: {item.quantity}</p>
                            <div className="text-teal-600 font-bold">LKR {item.price}</div>
                        </div>
                        <button onClick={() => handleRemove(item.cartId)} className="p-2 text-red-400 hover:bg-red-50 rounded-full">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="lg:w-80">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                    <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                    <div className="flex justify-between text-xl font-extrabold text-teal-800 mb-6">
                        <span>Total</span>
                        <span>LKR {total.toLocaleString()}</span>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/cart-checkout')}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex justify-center gap-2 hover:bg-gray-800">
                        Checkout <ArrowRight size={18} />
                    </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;