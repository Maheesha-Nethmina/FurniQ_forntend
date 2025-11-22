import React, { useEffect, useState } from 'react';
import { Filter, Loader2, AlertCircle, ShoppingCart, Ruler, Layers, CreditCard, Package, PackageX } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../Components/Navbar/Navbar';
import Hero from "../../Components/Hero/Hero";
import Footer from "../../Components/Footer/Footer";
import FurnitureHeroImage from "../../assets/fur6.jpeg";

const FurnitureCard = ({ item }) => {

  
 
    
  const {
    id,
    furnitureName,
    furniturePrice,
    furniturePicture,
    furnitureDetails,
    furnitureSize,
    furnitureType,
    furnitureQuantity,
    quantity
  } = item;

  const stock = furnitureQuantity !== undefined ? furnitureQuantity : (quantity !== undefined ? quantity : 0);
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 5;

  // --- Button Handlers ---
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    console.log(`Added ${furnitureName} to cart!`);
  };

  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    navigate(`/furnitureDetail/${id}`);
  };
  // -----------------------

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      
      {/* Type Badge (Top Left) */}
      {furnitureType && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
            {furnitureType}
          </span>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <img 
          src={furniturePicture || "https://via.placeholder.com/400x300?text=No+Image"} 
          alt={furnitureName}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-70' : 'group-hover:scale-105'}`}
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
             <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wider shadow-lg transform -rotate-6 border-2 border-white">
                SOLD OUT
             </span>
          </div>
        )}

        {/* Add to Cart Icon (Top Right) - Only show if in stock */}
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
        
        {/* Buy Now Button (Slides up) - Only show if in stock */}
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

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={furnitureName}>
            {furnitureName}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {furnitureDetails}
          </p>
        </div>

        {/* Footer Section (Stock, Size & Price) */}
        <div className="mt-auto pt-4 border-t border-dashed border-gray-100">
            
            <div className="flex items-center justify-between mb-3">
                {/* Size */}
                {furnitureSize ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50/80 px-2.5 py-1.5 rounded-lg">
                        <Ruler size={14} className="text-gray-400" />
                        <span className="truncate max-w-[80px]">{furnitureSize}</span>
                    </div>
                ) : <div></div>}

                {/* NEW: Stock Indicator */}
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

            {/* Price Section */}
            <div className="flex items-center justify-between items-end">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-1">
                  Price
                </span>
                <div className={`text-2xl font-extrabold ${isOutOfStock ? 'text-gray-400 decoration-slice' : 'text-teal-600'}`}>
                    <span className="text-sm font-bold mr-1">LKR</span>
                    {furniturePrice}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};


function Furniture() {
  const [furnitureList, setFurnitureList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getAllFurniture = async () => {
    try {
      setLoading(true);
      const response = await api.get('/furniture/getAllfurnitures');
      setFurnitureList(response.data.content || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching furniture:", err);
      setError("Failed to load furniture. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFurniture();
  }, []);

  // --- FILTER LOGIC ---
  const uniqueCategories = ["All", ...new Set(furnitureList.map(item => item.furnitureType).filter(Boolean))];

  const filteredItems = furnitureList.filter(item => {
    return selectedCategory === "All" || item.furnitureType === selectedCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <Hero
        image={FurnitureHeroImage}
        title={
          <>
            Comfort Meets <span className="text-amber-400">Design</span>
          </>
        }
        subtitle="Discover modern furniture made for your lifestyle."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col gap-8 mb-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                Latest Collection
              </h2>
              <p className="text-gray-500 mt-2 text-lg">
                Showing {filteredItems.length} items Available
              </p>
            </div>
          </div>

          {/* Category Pills */}
          {furnitureList.length > 0 && (
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
              <div className="flex items-center gap-2 text-gray-500 font-medium mr-2 bg-white py-1.5 px-3 rounded-full shadow-sm border border-gray-100">
                <Filter size={16} />
                <span className="text-sm">Filter by</span>
              </div>
              
              {uniqueCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border
                    ${selectedCategory === category 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200/50 transform scale-105' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'}
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- GRID CONTENT --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Loader2 size={50} className="animate-spin text-teal-500 mb-6" />
                <p className="font-semibold text-lg">Loading your collection...</p>
            </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center h-96 text-red-500 bg-red-50 rounded-3xl border border-red-100 p-10">
                <AlertCircle size={50} className="mb-6" />
                <p className="font-bold text-lg text-center max-w-md">{error}</p>
                <button 
                    onClick={getAllFurniture}
                    className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-red-200/50"
                >
                    Try Again
                </button>
            </div>
        ) : filteredItems.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Layers size={64} className="mx-auto text-gray-200 mb-6" strokeWidth={1.5} />
                <p className="text-2xl font-bold text-gray-400">No items found</p>
                <p className="text-gray-400 mt-3 text-lg">Try selecting a different category.</p>
                {selectedCategory !== "All" && (
                  <button 
                    onClick={() => setSelectedCategory("All")}
                    className="mt-8 px-6 py-2 text-teal-600 font-bold bg-teal-50 rounded-full hover:bg-teal-100 transition"
                  >
                    Clear Filters
                  </button>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {filteredItems.map((item) => (
                    <FurnitureCard key={item.id} item={item} />
                ))}
            </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default Furniture;