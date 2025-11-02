import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import img01 from "../../assets/image01.jpg";
import img02 from "../../assets/image02.jpg";
import img03 from "../../assets/image05.jpg";
import img04 from "../../assets/image06.webp";
import img05 from "../../assets/image07.webp";
import img06 from "../../assets/image08.webp";




const images = [img04,img02, img05, img06];

export default function Mainhero_section() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Images with Fade Transition */}
      {images.map((img, index) => (
        <motion.img
          key={img}
          src={img}
          alt="Hero background"
          className="absolute top-0 left-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === current ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero Text Content */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold mb-4 leading-tight">
          Transform Your Living
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Stylish, contemporary furniture that adapts to your lifestyle.
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="bg-amber-400 text-gray-900 text-1xl px-25 py-3 rounded-full font-medium shadow-lg hover:bg-amber-400 transition-all duration-300"
        >
          SHOP NOW
        </motion.button>
      </motion.div>

      {/* Optional gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </section>
  );
}
