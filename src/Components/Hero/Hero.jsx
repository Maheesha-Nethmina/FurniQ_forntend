import React from 'react';
import { motion } from 'framer-motion';

/**
 * A dynamic and reusable Hero component.
 * @param {object} props
 * @param {React.ReactNode} props.title - The main heading (can be a string or JSX).
 * @param {string} props.subtitle - The smaller text below the title.
 * @param {string} props.image - The background image (imported image variable).
 */
function Hero({ title, subtitle, image }) {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white overflow-hidden">
      {/* 1. Background Image with Dark Overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <img
          src={image}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </motion.div>

      {/* 2. Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold font-[Poppins] tracking-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default Hero;