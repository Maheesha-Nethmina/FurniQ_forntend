import React, { useState, useEffect } from "react";
import { User, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {/*  Navbar  */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-gray-900/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-b border-white/10"
            : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 text-white">
          {/* Logo */}
          <Link to="/">
            <h1 className="text-3xl font-extrabold tracking-tight font-[Poppins] cursor-pointer">
              <span className="text-white">Furni</span>
              <span className="text-amber-400">Q</span>
            </h1>
          </Link>

          {/* Menu Items */}
          <ul className="hidden md:flex space-x-10 text-sm font-serif uppercase tracking-wide">
            <li className="relative cursor-pointer transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-white/70 hover:after:w-full after:transition-all after:duration-300">
              <Link to="/">Home</Link>
            </li>
            <li className="relative cursor-pointer transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-white/70 hover:after:w-full after:transition-all after:duration-300">
              <Link to="/furniture">Furniture</Link>
            </li>
            <li className="relative cursor-pointer transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-white/70 hover:after:w-full after:transition-all after:duration-300">
              <Link to="/homedeco">Home Deco</Link>
            </li>
            <li className="relative cursor-pointer transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-white/70 hover:after:w-full after:transition-all after:duration-300">
              <Link to="/about">About Us</Link>
            </li>
            <li className="relative cursor-pointer transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-white/70 hover:after:w-full after:transition-all after:duration-300">
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>

          {/* Profile Icon + Dropdown */}
          <div className="relative profile-dropdown">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-md backdrop-blur-sm"
            >
              <User className="w-5 h-5 text-white" />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-lg py-2 animate-fadeIn">
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowRegister(true);
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/*  Login Modal  */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 text-white rounded-xl w-120 p-6 relative shadow-lg">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-400"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <button className="w-full bg-amber-400 text-black py-2 rounded font-semibold hover:opacity-90 transition">
              Login
            </button>
            <p className="mt-4 text-sm text-gray-300 text-center">
              Don't have an account?{" "}
              <span
                className="text-amber-400 cursor-pointer hover:underline"
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal  */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 text-white rounded-xl w-120 p-6 relative shadow-lg">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-400"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">Register</h2>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <button className="w-full bg-amber-400 text-black py-2 rounded font-semibold hover:opacity-90 transition">
              Register
            </button>
            <p className="mt-4 text-sm text-gray-300 text-center">
              Already have an account?{" "}
              <span
                className="text-amber-400 cursor-pointer hover:underline"
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
