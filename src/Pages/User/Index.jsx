import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Navbar/Navbar";
import Mainhero_section from "../../Components/Hero/Mainhero_section";
import trendingImg from "../../assets/image03.jpg";
import Footer from "../../Components/Footer/Footer";

function Index() {
  return (
    <>
      <Navbar />
      <Mainhero_section />

      {/* Why Choose Us Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-20 px-10 md:px-20 py-16 bg-white overflow-hidden font-sans">
        {/* Text Section */}
        <motion.div
          className="md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Heading with accent highlight */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 relative">
            <span className="relative z-10">Why You Choose Our Products</span>
            <span className="absolute left-0 top-2 w-20 h-1 bg-amber-300 rounded-full z-0"></span>
          </h2>

          {/* Paragraphs */}
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            Our trending collection brings you the most sought-after designs that redefine modern living. From sleek sofas to elegant dining pieces,
            every item is handpicked for its style, quality, and ability to transform your home into a space that feels fresh, timeless, and uniquely
            yours.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            Each piece is crafted to balance functionality with aesthetic appeal, ensuring your home not only looks stunning but also feels
            comfortable and inviting. Whether you’re revamping a single room or reimagining your entire space, our collection inspires creativity
            and elevates everyday living.
          </p>
        </motion.div>

        {/* Image Section */}
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

      {/* */}
      <section className="flex items-center justify-center py-32 bg-gradient-to-r from-white via-gray-50 to-white overflow-hidden font-sans">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center max-w-4xl px-6"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Stylish Entertainment Units for TV Displays and Smart Home Organization
          </h2>
        </motion.div>
      </section>


      <Footer />
    </>
  );
}

export default Index;
