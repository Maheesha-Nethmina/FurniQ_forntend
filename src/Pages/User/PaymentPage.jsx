import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Truck, MapPin, 
  CreditCard, User, Phone, Mail, Loader2
} from 'lucide-react';
import api from '../../api/axiosConfig'; 
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const PaymentPage = () => {
  // --- FIX 1: Rename 'id' to 'productId' to avoid confusion ---
  // This 'id' comes from the URL (e.g., /payment/101) -> That is the PRODUCT ID
  const { id: productId } = useParams(); 
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- FIX 2: Get the ACTUAL User ID from Local Storage for logging ---
  const storageUserId = localStorage.getItem('userId');

  console.log("🔍 DEBUG: Product ID (from URL):", productId);
  console.log("🔍 DEBUG: User ID (from LocalStorage):", storageUserId);

  const rawItem = location.state?.item;
  const itemType = location.state?.type || "FURNITURE"; 

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
    userId: storageUserId || "", // Use the variable we got from storage
    username: "", 
    email: "",
    mobileNumber: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);
  const [dataFetching, setDataFetching] = useState(true);

  // --- FETCH USER DETAILS ---
  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUserId = localStorage.getItem('userId');
      console.log("Fetching details for User ID:", currentUserId);

      if (currentUserId) {
        try {
          setDataFetching(true);
      
          const response = await api.get(`/auth/getUser/${currentUserId}`);
          
          if (response.data.code === "00") { 
            const user = response.data.content;
            
            setFormData(prev => ({
              ...prev,
              userId: currentUserId,
              username: user.username || user.name || "", 
              email: user.email || "",
              mobileNumber: user.mobileNumber || "", 
              address: "" 
            }));
          } 
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setDataFetching(false);
        }
      } else {
        console.warn("No User ID found in Local Storage");
        setDataFetching(false);
      }
    };

    fetchUserDetails();
  }, []); 

  // Redirect if no item data found
  useEffect(() => {
    if (!item) {
      alert("No item selected. Returning to collection.");
      navigate('/furniture');
    }
  }, [item, navigate]);

  if (!item) return null;

  // --- PRICE & SHIPPING LOGIC ---
  const price = Number(item.price);
  let shippingCost = 0;
  
  if (price < 5000) shippingCost = 500;
  else if (price >= 5000 && price < 10000) shippingCost = 700;
  else if (price >= 10000 && price < 25000) shippingCost = 2000;
  else if (price >= 25000 && price < 50000) shippingCost = 2500;
  else shippingCost = 3500;

  const totalAmount = price + shippingCost;

  // --- HANDLERS ---
  const handleChange = (e) => {
    if (e.target.name === 'username' || e.target.name === 'email') return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.mobileNumber) {
      alert("Please fill in your address and mobile number.");
      return;
    }

    setLoading(true);

    const orderDTO = {
      userId: parseInt(formData.userId),
      productId: parseInt(item.id),
      productName: item.name,
      quantity: 1, 
      price: parseFloat(totalAmount), 
      username: formData.username,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      oderType: itemType 
    };

    try {
      const response = await api.post('/order/saveNewOrder', orderDTO);
      
      if (response.data.code === "00") {
        alert("Order Placed Successfully! Check your email for confirmation.");
        navigate(itemType === "HOMEDECO" ? '/homedeco' : '/furniture');
      } else {
        alert("Order Failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to place order. Please try again.");
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
                  
                  {/* READ ONLY: Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-500" size={18}/>
                      <input 
                        type="text" 
                        name="username"
                        value={dataFetching ? "Loading..." : formData.username} 
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed select-none"
                      />
                    </div>
                  </div>
                  
                  {/* READ ONLY: Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-500" size={18}/>
                      <input 
                        type="email" 
                        name="email"
                        value={dataFetching ? "Loading..." : formData.email} 
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed select-none"
                      />
                    </div>
                  </div>
                </div>

                {/* EDITABLE: Mobile */}
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

                {/* EDITABLE: Address */}
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
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full">
                        {item.displayCategory}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 py-4 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">LKR {price.toLocaleString()}</span>
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