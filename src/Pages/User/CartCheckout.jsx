import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Phone, User, Loader2 } from 'lucide-react';

// --- IMPORTS ---
import api from '../../api/axiosConfig'; 
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import StripePaymentModal from '../../Components/Payment/StripePaymentModal'; // Ensure path is correct

const CartCheckout = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  
  // --- Payment State ---
  const [clientSecret, setClientSecret] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    address: ""
  });

  // 1. Fetch User Details & Cart Total on Load
  useEffect(() => {
    if (!userId) { 
        navigate('/login'); 
        return; 
    }

    const fetchData = async () => {
      try {
        // A. Fetch User Info
        const userRes = await api.get(`/auth/getUser/${userId}`);
        if (userRes.data.code === "00") {
            const u = userRes.data.content;
            setFormData(prev => ({
                ...prev,
                username: u.username || "",
                email: u.email || "",
                mobileNumber: u.mobileNumber || "",
                address: "" 
            }));
        }

        // B. Fetch Cart
        const cartRes = await api.get(`/cart/get/${userId}`);
        if (cartRes.data.code === "00") {
            const items = cartRes.data.content;
            const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            setCartTotal(total);
        }
      } catch (err) {
        console.error("Error loading checkout data", err);
      }
    };
    fetchData();
  }, [userId, navigate]);

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Calculate Shipping Logic
  let shippingCost = 0;
  if (cartTotal > 0) {
      if (cartTotal < 5000) shippingCost = 500;
      else if (cartTotal >= 5000 && cartTotal < 10000) shippingCost = 700;
      else if (cartTotal >= 10000 && cartTotal < 25000) shippingCost = 2000;
      else if (cartTotal >= 25000 && cartTotal < 50000) shippingCost = 2500;
      else shippingCost = 3500;
  }
  const grandTotal = cartTotal + shippingCost;

  // --- STEP 1: INITIATE PAYMENT (Get Client Secret) ---
  const handleInitiatePayment = async (e) => {
    e.preventDefault();

    if (!formData.address || !formData.mobileNumber) {
        alert("Please fill in your address and phone number.");
        return;
    }

    setLoading(true);

    try {
        // Call Backend to get Stripe Client Secret
        const paymentPayload = {
            amount: Math.round(grandTotal * 100), // Convert to cents (integer)
            currency: "lkr"
        };

        const response = await api.post('/payment/create-payment-intent', paymentPayload);
        
        if (response.data.clientSecret) {
            setClientSecret(response.data.clientSecret);
            setShowPaymentModal(true); // Open the Modal
        } else {
            alert("Failed to initialize payment gateway.");
        }
    } catch (error) {
        console.error("Payment Init Error:", error);
        alert("Could not connect to payment gateway.");
    } finally {
        setLoading(false);
    }
  };

  // --- STEP 2: SAVE ORDER (After Successful Payment) ---
  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false); // Close Modal
    setLoading(true); // Show loading on main page

    const checkoutRequest = {
        userId: parseInt(userId),
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        paymentStatus: "PAID (Stripe)" // Mark as Paid
    };

    try {
        const response = await api.post('/order/checkout', checkoutRequest);
        
        if (response.data.code === "00") {
            alert("Payment Successful! Order Placed.");
            // Refresh navbar badge count
            window.dispatchEvent(new Event("cartUpdated")); 
            navigate('/furniture'); 
        } else {
            alert("Payment success but Order Failed: " + response.data.message);
        }
    } catch (error) {
        console.error("Save Order Error:", error);
        alert("Critical Error: Payment taken but order not saved. Contact Support.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* --- RENDER STRIPE MODAL IF ACTIVE --- */}
      {showPaymentModal && clientSecret && (
        <StripePaymentModal 
            clientSecret={clientSecret} 
            amount={grandTotal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
        />
      )}

      <div className="flex-grow max-w-4xl mx-auto px-4 py-12 pt-24 w-full">
        
        <button 
            onClick={() => navigate('/cart')} 
            className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-8 font-medium transition"
        >
          <ArrowLeft size={20} /> Back to Cart
        </button>

        <div className="flex flex-col md:flex-row gap-8">
            
            {/* LEFT SIDE: Shipping Form */}
            <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="text-teal-600" /> Shipping Details
                </h2>
                
                {/* Note: Changed onSubmit to handleInitiatePayment */}
                <form onSubmit={handleInitiatePayment} className="space-y-4">
                    {/* Name (Read Only) */}
                    <div>
                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                            <User size={18} className="absolute left-3 top-3 text-gray-400"/>
                            <input 
                                type="text" 
                                name="username" 
                                value={formData.username} 
                                readOnly 
                                className="w-full pl-10 p-3 bg-gray-100 text-gray-600 rounded-xl border border-gray-200 cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div>
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <div className="relative mt-1">
                            <input 
                                type="text" 
                                name="email" 
                                value={formData.email} 
                                readOnly 
                                className="w-full p-3 bg-gray-100 text-gray-600 rounded-xl border border-gray-200 cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    {/* Mobile (Editable) */}
                    <div>
                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                        <div className="relative mt-1">
                            <Phone size={18} className="absolute left-3 top-3 text-gray-400"/>
                            <input 
                                type="text" 
                                name="mobileNumber" 
                                value={formData.mobileNumber} 
                                onChange={handleChange} 
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                                required 
                                placeholder="07XXXXXXXX"
                            />
                        </div>
                    </div>

                    {/* Address (Editable) */}
                    <div>
                        <label className="text-sm font-bold text-gray-700">Delivery Address</label>
                        <textarea 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            rows="3" 
                            className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition resize-none" 
                            required 
                            placeholder="Enter your full street address..."
                        ></textarea>
                    </div>
                </form>
            </div>

            {/* RIGHT SIDE: Payment Summary */}
            <div className="w-full md:w-96 h-fit bg-white p-6 rounded-3xl shadow-lg border border-teal-100 sticky top-24">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Payment Summary</h3>
                
                <div className="space-y-3 text-gray-600 text-sm mb-6">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>LKR {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                            {shippingCost === 0 ? "Free" : `LKR ${shippingCost.toLocaleString()}`}
                        </span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                    <div className="flex justify-between text-xl font-extrabold text-teal-800">
                        <span>Total</span>
                        <span>LKR {grandTotal.toLocaleString()}</span>
                    </div>
                </div>
                
                {/* Changed onClick to handleInitiatePayment */}
                <button 
                    onClick={handleInitiatePayment} 
                    disabled={loading || cartTotal === 0} 
                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold flex justify-center gap-2 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-lg hover:shadow-teal-200/50"
                >
                    {loading ? (
                        <> <Loader2 className="animate-spin" /> Processing... </>
                    ) : (
                        <> <CreditCard size={20}/> Pay & Place Order </>
                    )}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                    Secured by Stripe
                </p>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartCheckout;