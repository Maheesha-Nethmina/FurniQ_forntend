import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, CreditCard, Package,
  Ruler, CheckCircle, AlertCircle, Loader2,
  Plus, Minus 
} from 'lucide-react';
import api from '../../api/axiosConfig'; // Adjusted to ../
import Navbar from '../../Components/Navbar/Navbar'; // Adjusted to ../
import Footer from '../../Components/Footer/Footer'; // Adjusted to ../

function HomedecoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Quantity State
  const [selectedQty, setSelectedQty] = useState(1);

  // Fetch single deco item
  useEffect(() => {
    const getDecoDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/homedeco/getHomedecoById?id=${id}`);
        setItem(response.data.content);
      } catch (err) {
        setError("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };
    getDecoDetails();
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
      <button onClick={() => navigate('/homedeco')} className="mt-4 text-teal-600 underline">
        Go back to Collection
      </button>
    </div>
  );

  const stock = item.quantity || 0;
  const isOutOfStock = stock === 0;

  // 2. Price Calculation
  const unitPrice = Number(item.decoPrice) || 0;
  const totalPrice = unitPrice * selectedQty;

  // 3. Handlers
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

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
        
        <button 
          onClick={() => navigate('/homedeco')}
          className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition mb-4 font-medium"
        >
          <ArrowLeft size={20} /> Back to Decor
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Image Section */}
            <div className="h-80 lg:h-full bg-gray-100 relative">
              <img 
                src={item.decoPicture} 
                alt={item.decoName} 
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

            {/* Right: Details Section */}
            <div className="p-6 lg:p-10 flex flex-col">
              
              <span className="inline-block w-max px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                Home Decor
              </span>

              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {item.decoName}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-teal-600">
                  <span className="text-lg font-semibold mr-1 text-gray-400">LKR</span>
                  {item.decoPrice}
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
                  {item.decoDetails}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {item.decoSize && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Ruler size={16} /> <span className="text-xs font-bold uppercase">Dimensions</span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{item.decoSize}</p>
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
                
                {/* 4. Quantity Selector & Total Price */}
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

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    disabled={isOutOfStock}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-lg"
                    onClick={() => console.log(`Added ${selectedQty} items to cart`)}
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>

                  <button 
                    disabled={isOutOfStock}
                    className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-lg hover:shadow-teal-200"
                    onClick={() => navigate(`/payment/${item.id}`, {
                      state: {
                          item: item,
                          type: "HOMEDECO",
                          quantity: selectedQty, // 5. Passing Data
                          totalValue: totalPrice
                      }
                    })}
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

export default HomedecoDetail;