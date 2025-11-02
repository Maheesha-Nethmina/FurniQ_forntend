import React from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

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

// Animation variants for the container (staggered)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for the cards
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

function Index() {
  return (
    <>
      <Navbar />
      <Mainhero_section />

      {/* Why Choose Us Section (Existing) */}
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

      {/* --- NEW STYLISH "Our Services" Section --- */}
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
                           border border-neutral-200/80 shadow-lg shadow-black/5 
                           hover:shadow-xl transition-shadow duration-300 ease-in-out"
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 15 },
                }}
              >
                {/* Updated Icon Wrapper: Light background */}
                <div
                  className="p-4 bg-neutral-100/80
                             rounded-full mb-5"
                >
                  {service.icon}
                </div>

                {/* Updated Text Colors: Dark text for light card */}
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
      {/* --- END of "Our Services" Section --- */}

      {/* Stylish Entertainment Units (Existing) */}
      <section className="flex items-center justify-center py-32 bg-gradient-to-r from-white via-gray-50 to-white overflow-hidden font-sans">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center max-w-4xl px-6"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Stylish Entertainment Units for TV Displays and Smart Home
            Organization
          </h2>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

export default Index;