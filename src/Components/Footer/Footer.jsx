import React from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-neutral-900 text-white py-12 px-8 rounded-t-3xl mt-10 font-[Times_New_Roman]"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-[6fr_3fr_3fr] gap-8">
        {/* Brand Name */}
        <div>
         <Link to="/">
            <h1 className="text-3xl font-extrabold tracking-tight font-[Poppins] cursor-pointer">
              <span className="text-white">Furni</span>
              <span className="text-amber-400">Q</span>
            </h1>
          </Link>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-3 hover:text-amber-400">
              <Mail className="w-5 h-5" />
              <span>www.furniturefurniq@gmail.com</span>
            </li>
            <li className="flex items-center gap-3 hover:text-amber-400">
              <Phone className="w-5 h-5" />
              <span>0713456765</span>
            </li>
            <li className="flex items-center gap-3 hover:text-amber-400">
              <MessageCircle className="w-5 h-5" />
              <span>0713456765</span>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 ">Useful Links</h3>
          <ul className="space-y-3 text-gray-300">
            <li><Link to="/" className="hover:text-amber-400">Home</Link></li>
            <li><Link to="/furniture" className="hover:text-amber-400">Furniture</Link></li>
            <li><Link to="/homedeco" className="hover:text-amber-400">Home Deco</Link></li>
            <li><Link to="/about" className="hover:text-amber-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-amber-400">Contact Us</Link></li>
 
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm"
      >
        © 2025 FurniQ. All Rights Reserved.
      </motion.div>
    </motion.footer>
  );
}

export default Footer;
