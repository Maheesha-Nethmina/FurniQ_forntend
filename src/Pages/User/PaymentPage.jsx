import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Truck, MapPin, 
  CreditCard, User, Phone, Mail, Loader2
} from 'lucide-react';
// Corrected imports to prevent build errors
import api from '../../api/axiosConfig'; 
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const PaymentPage = () => {
  const { id: productId } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Get User ID from Local Storage
  const storageUserId = localStorage.getItem('userId');

  console.log("DEBUG: Payment Page Loaded. Storage UserID:", storageUserId);

  const rawItem = location.state?.item;
  const itemType = location.state?.type || "FURNITURE"; 
  const selectedQty = location.state?.quantity || 1; 

  // Normalizing Data
  const getNormalizedItem = () => {
    if (!rawItem) return null;
    if (itemType === "HOMEDECO") {
      return {
        id: rawItem.id,
        name: rawItem.decoName,
        price: rawItem.decoPrice,
        image: rawItem.decoPicture,
        displayCategory: "Home Decor"
      };
    } else {
      return {
        id: rawItem.id,
        name: rawItem.furnitureName,
        price: rawItem.furniturePrice,
        image: rawItem.furniturePicture,
        displayCategory: "Furniture" 
      };
    }
  };

  const item = getNormalizedItem();

  const [formData, setFormData] = useState({
    userId: storageUserId || "", 
    username: "", 
    email: "",
    mobileNumber: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);
  
  // 2. Fetch User Data on Mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      // Debugging: Check if ID exists
      if (!storageUserId) {
        console.warn("DEBUG: No User ID found in LocalStorage. Please Log Out and Log In again.");
        return;
      }

      try {
        // console.log(`DEBUG: Fetching user details for ID: ${storageUserId}...`);
        const response = await api.get(`/auth/getUser/${storageUserId}`);
        
        // console.log("DEBUG: API Response:", response.data);

        if (response.data.code === "00") { 
          const user = response.data.content;
          // console.log("DEBUG: User Details Found:", user);
          
          // 3. Populate State with DB Data
          setFormData(prev => ({
            ...prev,
            username: user.username || "", 
            email: user.email || "",
            mobileNumber: user.mobileNumber || "", 
            address: "" // Address kept empty for user to fill
          }));
        } else {
            console.error("DEBUG: Failed to fetch user. Code:", response.data.code);
        }
      } catch (error) {
        console.error("DEBUG: Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [storageUserId]); 

  // Redirect if no item
  useEffect(() => {
    if (!item) {
      alert("No item selected. Returning to collection.");
      navigate('/furniture');
    }
  }, [item, navigate]);

  if (!item) return null;

  // --- Calculations ---
  const unitPrice = Number(item.price);
  const subTotal = unitPrice * selectedQty;
  let shippingCost = 0;
  
  if (subTotal < 5000) shippingCost = 500;
  else if (subTotal >= 5000 && subTotal < 10000) shippingCost = 700;
  else if (subTotal >= 10000 && subTotal < 25000) shippingCost = 2000;
  else if (subTotal >= 25000 && subTotal < 50000) shippingCost = 2500;
  else shippingCost = 3500;

  const totalAmount = subTotal + shippingCost;

  // --- Handlers ---
  const handleChange = (e) => {
    // Prevent editing of username and email
    if (e.target.name === 'username' || e.target.name === 'email') return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // console.log("DEBUG: Placing Order with Data:", formData);

    if (!formData.address || !formData.mobileNumber) {
      alert("Please fill in your address and mobile number.");
      return;
    }

    setLoading(true);

    const orderDTO = {
      userId: parseInt(storageUserId), 
      productId: parseInt(item.id),
      productName: item.name,
      quantity: selectedQty, 
      price: parseFloat(totalAmount), 
      username: formData.username,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      oderType: itemType,
      oderStatus: "To Be Ship", 
      paymentStatus: "yes"
    };

    try {
      const response = await api.post('/order/saveNewOrder', orderDTO);
      // console.log("DEBUG: Order Response:", response.data);
      
      if (response.data.code === "00") {
        alert("Order Placed Successfully!");
        navigate(itemType === "HOMEDECO" ? '/homedeco' : '/furniture');
      } else {
        alert("Order Failed: " + response.data.message);
      }
    } catch (error) {
      console.error("DEBUG: Payment Error:", error);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-8 transition font-medium"
        >
          <ArrowLeft size={20} /> Back to Product
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- LEFT SIDE: SHIPPING FORM --- */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-teal-600" /> Shipping Details
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name (READ ONLY) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-500" size={18}/>
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username} 
                        readOnly // <--- BLOCKED
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed select-none"
                      />
                    </div>
                  </div>
                  
                  {/* Email (READ ONLY) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-500" size={18}/>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email} 
                        readOnly // <--- BLOCKED
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed select-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile (EDITABLE) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
                    <input 
                      type="text" 
                      name="mobileNumber"
                      placeholder="Enter your mobile number"
                      value={formData.mobileNumber} 
                      onChange={handleChange} 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Address (EDITABLE) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
                  <textarea 
                    name="address"
                    rows="4"
                    placeholder="Enter your full delivery address..."
                    value={formData.address} 
                    onChange={handleChange} 
                    required
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>

          {/* --- RIGHT SIDE: ORDER SUMMARY --- */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              
              <div className="p-2 bg-gray-50">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-2xl" 
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <div className="flex gap-2 mt-1">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full">
                            {item.displayCategory}
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase rounded-full">
                            Qty: {selectedQty}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 py-4 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Unit Price</span>
                    <span className="font-medium">LKR {unitPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({selectedQty} items)</span>
                    <span className="font-medium">LKR {subTotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                        <Truck size={14}/> Shipping
                        {shippingCost === 0 && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">FREE</span>}
                    </span>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                      {shippingCost === 0 ? "LKR 0" : `LKR ${shippingCost.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-gray-100 mt-2">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-teal-600">
                    LKR {totalAmount.toLocaleString()}
                  </span>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-teal-700 transition shadow-lg hover:shadow-teal-200/50 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} /> Pay Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;