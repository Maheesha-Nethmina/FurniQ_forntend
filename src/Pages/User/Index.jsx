import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import api from "../../api/axiosConfig"; 
import Navbar from "../../Components/Navbar/Navbar";
import Mainhero_section from "../../Components/Hero/Mainhero_section";
import trendingImg from "../../assets/image03.jpg"; 
import Footer from "../../Components/Footer/Footer";

import {
  Truck,
  Wrench,
  Sofa,
  ShoppingCart,
  CreditCard,
  Headset,
  ArrowRight,
  ArrowUpRight,
  Armchair,
  Tv,
  Lamp,
  Home,
  Bed,
  Palette,
  Loader2,
} from "lucide-react";

// --- Utility: Format Price ---
const formatPrice = (price) => {
  if (!price) return "0";
  return new Intl.NumberFormat('en-LK', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const services = [
  {
    title: "Free Delivery",
    description: "Experience fast, reliable, and hassle-free delivery services that bring your orders straight to your doorstep, right on time, every time.",
    icon: <Truck className="w-8 h-8 text-amber-400" />,
  },
  {
    title: "Custom Furniture",
    description: "Experience beautifully tailored designs crafted to perfectly complement your unique style and seamlessly fit into your space.",
    icon: <Wrench className="w-8 h-8 text-amber-400" />,
  },
  {
    title: "Interior Consultation",
    description: "Receive expert guidance every step of the way to help you design, plan, and create the home of your dreams—perfectly tailored to your lifestyle and vision.",
    icon: <Sofa className="w-8 h-8 text-amber-400" />,
  },
  {
    title: "Easy Returns",
    description: "Shop with complete confidence knowing that our straightforward and hassle-free return policy ensures a smooth and worry-free shopping experience every time.",
    icon: <ShoppingCart className="w-8 h-8 text-amber-400" />,
  },
  {
    title: "Flexible Payment",
    description: "Bring home the furniture you love today and enjoy flexible, stress-free payment options that make decorating your space easier than ever.",
    icon: <CreditCard className="w-8 h-8 text-amber-400" />,
  },
  {
    title: "After Sales Support",
    description: "We’re here for you long after your purchase, providing continuous support and care to ensure your complete satisfaction with every detail.",
    icon: <Headset className="w-8 h-8 text-amber-400" />,
  },
];

const furnitureCategories = [
  { name: "Premium Lounge Sets", link: "/furniture" },
  { name: "Executive Workspace", link: "/furniture" },
  { name: "Master Bedroom Suites", link: "/furniture" },
  { name: "Modern Dining Collections", link: "/furniture" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
  },
};

// --- REUSABLE PRODUCT CARD COMPONENT ---
const ProductCard = ({ image, name, price, tag, onClick }) => (
  <motion.div 
    variants={cardVariants}
    onClick={onClick}
    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative cursor-pointer"
  >
    {/* Tag (New / Trending) */}
    <div className="absolute top-3 left-3 z-10">
      <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
        {tag}
      </span>
    </div>

    {/* Image Area */}
    <div className="relative h-64 overflow-hidden bg-gray-50">
      <img 
        src={image || "https://via.placeholder.com/400x300?text=No+Image"} 
        alt={name} 
        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Sliding Button Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
        <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 shadow-lg transition-all active:scale-95">
          View Details <ArrowRight size={18} />
        </button>
      </div>
    </div>

    {/* Content Area */}
    <div className="p-5 flex flex-col flex-grow">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 transition-colors">
          {name}
        </h3>
      </div>

      {/* Footer: Price & Icon */}
      <div className="mt-auto pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
            <div className="text-xl font-extrabold text-teal-600">
               <span className="text-sm font-bold mr-1">LKR</span>
               {formatPrice(price)}
            </div>
         </div>
         
      </div>
    </div>
  </motion.div>
);


function Index() {
  const navigate = useNavigate();
  
  const [newArrivals, setNewArrivals] = useState([]);
  const [homeDeco, setHomeDeco] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [furnitureRes, homeDecoRes] = await Promise.all([
            api.get("/furniture/getAllfurnitures"),
            api.get("/homedeco/getAllHomedeco")
        ]);
        
        // 1. Process Furniture
        const furnitureData = Array.isArray(furnitureRes.data) ? furnitureRes.data : (furnitureRes.data.content || []);
        const sortedFurniture = furnitureData
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);
        setNewArrivals(sortedFurniture);

        // 2. Process Home Deco
        const decoData = Array.isArray(homeDecoRes.data) ? homeDecoRes.data : (homeDecoRes.data.content || []);
        const sortedDeco = decoData
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);
        setHomeDeco(sortedDeco);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleExploreClick = () => {
    navigate("/furniture");
  };

  const handleDecoClick = () => {
    navigate("/homedeco");
  };

  const handleFurnitureDetail = (id) => {
    navigate(`/furnitureDetail/${id}`);
  };

  const handleDecoDetail = (id) => {
    navigate(`/homedecoDetail/${id}`);
  };

  return (
    <>
      <Navbar />
      <Mainhero_section />

      <section className="bg-white font-sans border-b border-gray-100">
        
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center gap-6 md:gap-12 text-gray-400">
            <span className="text-sm font-bold tracking-widest text-gray-800 uppercase mr-4">
              Endorsed By
            </span>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <Sofa className="w-5 h-5" /> <span className="font-serif italic text-gray-600">LuxeLiving</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <Home className="w-5 h-5" /> <span className="font-bold text-gray-600">Habitat+</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <Tv className="w-5 h-5" /> <span className="font-mono text-gray-600">MODERNIST</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <Lamp className="w-5 h-5" /> <span className="font-serif text-gray-600">DecorDigest</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <Armchair className="w-5 h-5" /> <span className="font-bold text-gray-600">EliteHomes</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <Bed className="w-5 h-5" /> <span className="font-serif italic text-gray-600">SleepHaven</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <Palette className="w-5 h-5" /> <span className="font-bold tracking-tight text-gray-600">DesignStudio</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div 
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Craft Your Signature Space
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Step into a world where comfort meets curation. Whether you are 
                redesigning a cozy nook or outfitting an open-plan sanctuary, 
                our pieces are designed to tell your unique story through texture, 
                form, and function.
              </p>
            </motion.div>

            <motion.div 
              className="lg:col-span-4 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src={trendingImg} 
                alt="Interior Design Showcase" 
                className="rounded-3xl shadow-2xl object-cover h-[400px] w-full max-w-md"
              />
            </motion.div>

            <motion.div 
              className="lg:col-span-4 pl-0 lg:pl-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col space-y-2">
                {furnitureCategories.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={handleExploreClick} 
                    className="group cursor-pointer flex items-center justify-between py-4 border-b border-gray-200 hover:border-gray-400 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-gray-400 group-hover:text-gray-900 transition-colors">
                       <ArrowRight className="w-5 h-5 group-hover:hidden" />
                       <ArrowUpRight className="w-5 h-5 hidden group-hover:block" />
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={handleExploreClick}
                className="mt-10 px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Collections
              </motion.button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- NEW ARRIVALS FURNITURE SECTION --- */}
      <section className="py-20 bg-neutral-50 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">New Arrivals Furniture</h2>
               <p className="text-gray-500 mt-2">Check out the latest furniture additions.</p>
            </motion.div>
            
            <motion.button
                onClick={handleExploreClick}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="hidden md:flex items-center gap-2 text-teal-700 font-semibold hover:text-amber-500 transition-colors"
            >
               View all furniture <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
             </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {newArrivals.length > 0 ? (
                newArrivals.map((item) => (
                  <ProductCard
                    key={item.id}
                    image={item.furniturePicture}
                    name={item.furnitureName}
                    price={item.furniturePrice}
                    tag="NEW"
                    onClick={() => handleFurnitureDetail(item.id)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400">No furniture arrivals found.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>


      {/* --- TRENDING HOME DECOR SECTION --- */}
      <section className="py-20 bg-white font-sans border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
               
               <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Trending Home Decor</h2>
               <p className="text-gray-500 mt-2">The finishing touches that make a house a home.</p>
            </motion.div>
            
            <motion.button
                onClick={handleDecoClick}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="hidden md:flex items-center gap-2 text-gray-900 font-semibold hover:text-amber-500 transition-colors"
            >
               View all Decor <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
             </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {homeDeco.length > 0 ? (
                homeDeco.map((item) => (
                  <ProductCard
                    key={item.id}
                    image={item.decoPicture}
                    name={item.decoName}
                    price={item.decoPrice}
                    tag="Trending"
                    onClick={() => handleDecoDetail(item.id)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400">No home decor items found.</p>
                </div>
              )}
            </motion.div>
          )}

           <div className="mt-8 flex justify-center md:hidden">
            <button
                onClick={handleDecoClick}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 font-semibold shadow-sm"
            >
               View all Decor <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-20 bg-neutral-50 font-sans">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Our Services
          </motion.h2>

          <motion.p
            className="text-lg text-center text-gray-600 mb-16 mt-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            What we do for you
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                className="bg-white rounded-2xl p-8 flex flex-col items-center text-center 
                           border border-neutral-200/50 hover:shadow-lg transition-shadow duration-300 ease-in-out"
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 15 },
                }}
              >
                <div
                  className="p-4 bg-neutral-50 shadow-sm
                             rounded-full mb-5"
                >
                  {service.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-20 px-10 md:px-20 py-16 bg-white overflow-hidden font-sans">
        <motion.div
          className="md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 relative">
            <span className="relative z-10">Why You Choose Our Products</span>
            <span className="absolute left-0 top-2 w-20 h-1 bg-amber-300 rounded-full z-0"></span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            Our trending collection brings you the most sought-after designs
            that redefine modern living. From sleek sofas to elegant dining
            pieces, every item is handpicked for its style, quality, and
            ability to transform your home into a space that feels fresh,
            timeless, and uniquely yours.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            Each piece is crafted to balance functionality with aesthetic
            appeal, ensuring your home not only looks stunning but also feels
            comfortable and inviting. Whether you’re revamping a single room or
            reimagining your entire space, our collection inspires creativity
            and elevates everyday living.
          </p>
        </motion.div>

        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.img
            src={trendingImg}
            alt="Trending Product"
            className="rounded-2xl shadow-xl w-full object-cover h-[420px]"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

export default Index;