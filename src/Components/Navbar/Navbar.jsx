import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, X, Menu, ShoppingCart } from "lucide-react";
// 1. Import the centralized API config instead of axios
import { useAuth } from "../../context/AuthContext";
import api from '../../api/axiosConfig';

// 2. Removed the hardcoded API_URL constant

const Navbar = () => {
  const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "Furniture", path: "/furniture" },
    { label: "Home Deco", path: "/homedeco" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //check the url
  console.log("Current Base URL:", import.meta.env.VITE_API_BASE_URL);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (authModal === "register") {
        if (formData.password !== formData.confirmPassword) {
          setMessage("Passwords do not match!");
          setLoading(false);
          return;
        }

        const res = await api.post('/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          mobileNumber: formData.mobileNumber,
        });

        setMessage(res.data.message || "Registration successful!");

        // Auto-login the user
        login(res.data);

        // Close modal
        setTimeout(() => {
          setAuthModal(null);
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            mobileNumber: "",
          });
          setMessage("");
        }, 1200);

      } else if (authModal === "login") {
        
        const res = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        setMessage(res.data.message || "Login successful!");

        // Login the user
        login(res.data);

        // Check role and navigate
        if (res.data.role === "ADMIN") {
          navigate("/admin");
        }

        // Close modal
        setTimeout(() => {
          setAuthModal(null);
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            mobileNumber: "",
          });
          setMessage("");
        }, 1200);
      }
    } catch (err) {
      // Handle errors gracefully
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Something went wrong. Please try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderLinks = (isMobile = false) => (
    <ul
      className={`${
        isMobile
          ? "flex flex-col space-y-6 mt-8 text-center font-serif uppercase tracking-wide text-lg"
          : "hidden md:flex space-x-10 text-sm font-serif uppercase tracking-wide"
      }`}
    >
      {NAV_LINKS.map(({ label, path }) => (
        <li
          key={label}
          className={
            isMobile
              ? "hover:text-amber-400 transition-all duration-300"
              : "relative cursor-pointer transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[1px] after:bg-white/70 hover:after:w-full after:transition-all after:duration-300"
          }
        >
          <Link to={path} onClick={() => setMobileMenuOpen(false)}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-gray-900/80 shadow-lg border-b border-white/10"
            : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
          <Link to="/">
            <h1 className="text-3xl font-extrabold tracking-tight font-[Poppins] cursor-pointer">
              <span className="text-white">Furni</span>
              <span className="text-amber-400">Q</span>
            </h1>
          </Link>

          {renderLinks()}

          <div className="flex items-center space-x-4">
            {/* Cart Icon Link */}
            {user && user.role === "USER" && (
              <Link
                to="/cart"
                className="p-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 shadow-md backdrop-blur-sm"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </Link>
            )}

            <div className="relative profile-dropdown">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-md backdrop-blur-sm"
              >
                <User className="w-5 h-5 text-white" />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-gray-900/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-lg py-2 animate-fadeIn">
                  {user ? (
                    <>
                      {user.role === "ADMIN" ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300 text-sm truncate font-bold text-amber-400"
                        >
                          ADMIN
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300 text-sm truncate"
                        >
                          {user.username}
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAuthModal("login");
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setAuthModal("register");
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-gray-900 text-white z-[60] transform transition-transform duration-500 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-2xl font-bold">
            <span className="text-white">Furni</span>
            <span className="text-amber-400">Q</span>
          </h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X />
          </button>
        </div>
        {renderLinks(true)}
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[50]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 text-white rounded-xl w-96 p-6 relative shadow-lg">
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-3 right-3 text-white hover:text-gray-400"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {authModal === "login" ? "Login" : "Register"}
            </h2>

            {authModal === "register" && (
              <>
                <input
                  type="text"
                  name="username"
                  placeholder="Full Name"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Phone Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
            />

            {authModal === "register" && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-amber-400"
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-400 text-black py-2 rounded font-semibold hover:opacity-90 transition"
            >
              {loading
                ? "Please wait..."
                : authModal === "login"
                ? "Login"
                : "Register"}
            </button>

            {message && (
              <p
                className={`mt-3 text-center text-sm ${
                  message.includes("successful")
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-4 text-sm text-gray-300 text-center">
              {authModal === "login"
                ? "Don’t have an account?"
                : "Already have an account?"}{" "}
              <span
                className="text-amber-400 cursor-pointer hover:underline"
                onClick={() => {
                  setAuthModal(authModal === "login" ? "register" : "login");
                  setMessage("");
                }}
              >
                {authModal === "login" ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;