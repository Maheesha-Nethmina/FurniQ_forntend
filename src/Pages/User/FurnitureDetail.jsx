import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, CreditCard, Package,
  Ruler, CheckCircle, AlertCircle, Loader2,
  Plus, Minus 
} from 'lucide-react';
import api from '../../api/axiosConfig'; 
import Navbar from '../../Components/Navbar/Navbar'; 
import Footer from '../../Components/Footer/Footer'; 

function FurnitureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Quantity Selection
  const [selectedQty, setSelectedQty] = useState(1);
  // State for Add to Cart loading button feedback
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch item data
  useEffect(() => {
    const getFurnitureDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/furniture/getFurnitureById?id=${id}`);
        setItem(response.data.content);
      } catch (err) {
        setError("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };
    getFurnitureDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 size={50} className="animate-spin text-teal-600" />
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-red-500">
      <AlertCircle size={50} className="mb-4" />
      <p className="text-xl font-semibold">{error || "Item not found"}</p>
      <button onClick={() => navigate('/furniture')} className="mt-4 text-teal-600 underline">
        Go back to Furniture
      </button>
    </div>
  );

  const stock = item.furnitureQuantity || item.quantity || 0;
  const isOutOfStock = stock === 0;
  
  // Calculate Total Price dynamically
  const unitPrice = Number(item.furniturePrice) || 0;
  const totalPrice = unitPrice * selectedQty;

  // Quantity Handlers
  const handleIncrease = () => {
    if (selectedQty < stock) {
      setSelectedQty(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (selectedQty > 1) {
      setSelectedQty(prev => prev - 1);
    }
  };

  
  const handleAddToCart = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert("Please Log in to add items to cart");
      navigate('/furniture'); // Optional: redirect to login
      return;
    }

    setAddingToCart(true);

    const cartItem = {
        userId: parseInt(userId),
        productId: item.id,
        productType: "FURNITURE",
        quantity: selectedQty
    };

    try {
        const response = await api.post('/cart/add', cartItem);
        
        if(response.data.code === "00"){
            // Success Feedback
            alert("Item added to cart successfully!");
        } else {
            alert("Failed to add to cart: " + response.data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Error connecting to server. Please try again.");
    } finally {
        setAddingToCart(false);
    }
  };

  // Buy Now Handler (Direct Checkout)
  const handleBuyNow = () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("Please Log in to proceed");
      return;
    }

    // Redirect to payment with state
    navigate(`/payment/${item.id}`, { 
        state: { 
            item: item, 
            type: "FURNITURE", 
            quantity: selectedQty, 
            totalValue: totalPrice 
        } 
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 w-full">
        
        <button 
          onClick={() => navigate('/furniture')}
          className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition mb-4 font-medium"
        >
          <ArrowLeft size={20} /> Back to Collection
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Section */}
            <div className="h-80 lg:h-[550px] bg-gray-100 relative">
              <img 
                src={item.furniturePicture} 
                alt={item.furnitureName} 
                className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
              />
              {isOutOfStock && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-xl transform -rotate-12">
                        SOLD OUT
                    </span>
                 </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 lg:p-10 flex flex-col">
              
              {item.furnitureType && (
                <span className="inline-block w-max px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                  {item.furnitureType}
                </span>
              )}

              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {item.furnitureName}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-teal-600">
                  <span className="text-lg font-semibold mr-1 text-gray-400">LKR</span>
                  {item.furniturePrice}
                </div>
                
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                    isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                }`}>
                    {isOutOfStock ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full my-1"></div>

              <div className="py-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {item.furnitureDetails}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {item.furnitureSize && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Ruler size={16} /> <span className="text-xs font-bold uppercase">Dimensions</span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{item.furnitureSize}</p>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Package size={16} /> <span className="text-xs font-bold uppercase">Availability</span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {isOutOfStock ? "Unavailable" : `${stock} units left`}
                      </p>
                  </div>
              </div>

              <div className="mt-auto space-y-4">
                {/* Quantity Selector & Total Price Display */}
                {!isOutOfStock && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    
                    {/* Quantity Controls */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</span>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button 
                            onClick={handleDecrease}
                            disabled={selectedQty <= 1}
                            className="p-2 px-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <Minus size={16} />
                          </button>
                          <div className="w-10 text-center font-bold text-gray-900">
                            {selectedQty}
                          </div>
                          <button 
                            onClick={handleIncrease}
                            disabled={selectedQty >= stock}
                            className="p-2 px-3 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        {selectedQty === stock && (
                          <span className="text-[10px] text-amber-600 font-medium">Max reached</span>
                        )}
                    </div>

                    {/* Total Price Display */}
                    <div className="text-right">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</span>
                        <div className="text-2xl font-extrabold text-teal-700">
                            <span className="text-sm font-semibold text-gray-400 mr-1">LKR</span>
                            {totalPrice.toLocaleString()}
                        </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    disabled={isOutOfStock || addingToCart}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-lg"
                    onClick={handleAddToCart}
                  >
                    {addingToCart ? (
                        <> <Loader2 size={20} className="animate-spin" /> Adding... </>
                    ) : (
                        <> <ShoppingCart size={20} /> Add to Cart </>
                    )}
                  </button>

                  <button 
                    disabled={isOutOfStock}
                    className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-lg hover:shadow-teal-200"
                    onClick={handleBuyNow}
                  >
                    <CreditCard size={20} /> Buy Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default FurnitureDetail;