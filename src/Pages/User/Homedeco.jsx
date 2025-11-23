import React, { useEffect, useState } from 'react';
import { Filter, Loader2, AlertCircle, ShoppingCart, Ruler, Layers, CreditCard, Package, PackageX } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';


import Navbar from '../../Components/Navbar/Navbar';
import Hero from "../../Components/Hero/Hero";
import Footer from "../../Components/Footer/Footer";
import homedecoHeroImage from "../../assets/fur7.jpeg";

const HomedecoCard = ({ item }) => {
  const navigate = useNavigate();

  const { 
    id, 
    decoName, 
    decoPrice, 
    decoPicture, 
    decoDetails, 
    decoSize, 
    quantity 
  } = item;

  const stock = quantity || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 5;

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    if (isOutOfStock) return;
    console.log(`Added ${decoName} to cart!`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    navigate(`/homedecoDetail/${id}`); 
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <img 
          src={decoPicture || "https://via.placeholder.com/400x300?text=No+Image"} 
          alt={decoName}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-70' : 'group-hover:scale-105'}`}
        />
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
             <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wider shadow-lg transform -rotate-6 border-2 border-white">
                SOLD OUT
             </span>
          </div>
        )}

        {!isOutOfStock && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleAddToCart}
              className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all shadow-sm hover:shadow-md active:scale-95"
              title="Add to Cart"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}
        
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button 
              onClick={handleBuyNow}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 shadow-lg hover:shadow-teal-200/50 transition-all active:scale-95"
            >
              <CreditCard size={20} />
              Buy Now
            </button>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={decoName}>
            {decoName}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {decoDetails}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-dashed border-gray-100">
            
            <div className="flex items-center justify-between mb-3">
                {decoSize ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50/80 px-2.5 py-1.5 rounded-lg">
                        <Ruler size={14} className="text-gray-400" />
                        <span className="truncate max-w-[80px]">{decoSize}</span>
                    </div>
                ) : <div></div>}

                <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg ${
                    isOutOfStock 
                      ? 'bg-red-50 text-red-600' 
                      : isLowStock 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-green-50 text-green-600'
                }`}>
                    {isOutOfStock ? <PackageX size={14}/> : <Package size={14}/>}
                    <span>
                        {isOutOfStock ? "Out of Stock" : isLowStock ? `Only ${stock} left!` : `${stock} Available`}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between items-end">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-1">
                  Price
                </span>
                <div className={`text-2xl font-extrabold ${isOutOfStock ? 'text-gray-400 decoration-slice' : 'text-teal-600'}`}>
                    <span className="text-sm font-bold mr-1">LKR</span>
                    {decoPrice}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

function Homedeco() {
  const [decoList, setDecoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllHomedeco = async () => {
    try {
      setLoading(true);
      const response = await api.get('/homedeco/getAllHomedeco');
      setDecoList(response.data.content || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching deco:", err);
      setError("Failed to load home decor items. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllHomedeco();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <Hero
        image={homedecoHeroImage}
        title={
          <>
            Bring Life to <span className="text-amber-400">Every Space</span>
          </>
        }
        subtitle="Discover charming décor pieces that make your house feel like home."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Decor Collection
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Showing {decoList.length} curated items
            </p>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Loader2 size={50} className="animate-spin text-teal-500 mb-6" />
                <p className="font-semibold text-lg">Loading collection...</p>
            </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center h-96 text-red-500 bg-red-50 rounded-3xl border border-red-100 p-10">
                <AlertCircle size={50} className="mb-6" />
                <p className="font-bold text-lg text-center max-w-md">{error}</p>
                <button onClick={getAllHomedeco} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg">
                    Try Again
                </button>
            </div>
        ) : decoList.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Layers size={64} className="mx-auto text-gray-200 mb-6" strokeWidth={1.5} />
                <p className="text-2xl font-bold text-gray-400">No items found</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {decoList.map((item) => (
                    <HomedecoCard key={item.id} item={item} />
                ))}
            </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default Homedeco;