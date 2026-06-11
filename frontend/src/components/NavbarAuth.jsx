import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/asterism-logo-white.svg";
import svgSearch from "../assets/icons/search-icon.svg";
import svgGmail from "../assets/icons/icon-gmail-white.svg";
import svgPhone from "../assets/icons/icon-phone-white.svg";
import svgInstagram from "../assets/icons/icon-ig-white.svg";
import svgLike from "../assets/icons/ecommerce/navbar/like-white-icon.svg";
import svgCart from "../assets/icons/ecommerce/navbar/shop-white-icon.svg";
import svgProfile from "../assets/icons/ecommerce/navbar/profile-white-icon.svg";

export default function NavbarAuth() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah login dan apakah admin
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          const email =
            userData.email || (userData.user && userData.user.email);
          const userGroupId =
            userData.user_group_id ||
            (userData.user && userData.user.user_group_id);
          setIsAdmin(email === "admin@asterism.com" || userGroupId === 1);
        } catch (e) {
          setIsAdmin(false);
        }
      }
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${query}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isProfileMenuOpen) {
      const handleClickOutside = () => {
        closeProfileMenu();
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isProfileMenuOpen]);

  return (
    <header className="fixed w-full top-0 z-50 bg-black max-h-24">
      {/* MAIN NAVBAR */}
      <nav className="bg-black px-6 py-2 max-h-full">
        <div className="max-w-7xl mx-auto flex flex-col">
          {/* CONTACT INFO WITH FULL WIDTH BORDER */}
          <div className="hidden md:flex items-center gap-6 pb-2 border-b border-gray-700 w-full">
            <div className="flex items-center gap-2">
              <img src={svgGmail} alt="Gmail" className="w-4 h-4" />
              <span className="text-xs text-gray-300">
                asterism.303@gmail.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img src={svgPhone} alt="Phone" className="w-4 h-4" />
              <span className="text-xs text-gray-300">(+62)851-9760-3771</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={svgInstagram} alt="Instagram" className="w-4 h-4" />
              <span className="text-xs text-gray-300">asterism.idn</span>
            </div>
          </div>

          {/* ROW FOR LOGO, NAV, SEARCH, ICONS */}
          <div className="flex items-center justify-between pt-2">
            {/* LOGO */}
            <div className="flex-shrink-0">
              <Link to="/company">
                <h1 className="text-xl font-bold text-white tracking-widest">
                  ASTERISM.IDN
                </h1>
              </Link>
            </div>

            {/* DESKTOP NAVIGATION */}
            <ul className="hidden md:flex items-center gap-8">
              <li>
                <Link
                  to="/company"
                  className="text-white text-sm font-semibold tracking-wider hover:text-gray-300 transition-colors"
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  to="/company/about"
                  className="text-white text-sm font-semibold tracking-wider hover:text-gray-300 transition-colors"
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link
                  to="/company/products"
                  className="text-white text-sm font-semibold tracking-wider hover:text-gray-300 transition-colors"
                >
                  PRODUCTS
                </Link>
              </li>
              <li>
                <Link
                  to="/company/contact"
                  className="text-white text-sm font-semibold tracking-wider hover:text-gray-300 transition-colors"
                >
                  CONTACT
                </Link>
              </li>
            </ul>

            {/* SEARCH AND ICONS */}
            <div className="flex items-center gap-4">
              {/* SEARCH */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 border border-gray-600 px-3 py-1.5 rounded-full">
                <img
                  src={svgSearch}
                  alt="Search"
                  className="w-4 h-4 text-white"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 w-40"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>

              {/* ICONS */}
              <div className="flex items-center gap-4">
                <button className="text-white hover:text-gray-300 transition-colors">
                  <img src={svgLike} alt="Like" className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-gray-300 transition-colors">
                  <img src={svgCart} alt="Cart" className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    className="text-white hover:text-gray-300 transition-colors"
                    onClick={toggleProfileMenu}
                  >
                    <img src={svgProfile} alt="Profile" className="w-5 h-5" />
                  </button>

                  {/* Profile Popup */}
                  {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                      {isLoggedIn ? (
                        <>
                          {isAdmin ? (
                            <Link
                              to="/ecommerce/admin/dashboard"
                              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                              onClick={closeProfileMenu}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"
                                />
                              </svg>
                              Admin Dashboard
                            </Link>
                          ) : (
                            <Link
                              to="/ecommerce/orders"
                              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                              onClick={closeProfileMenu}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                />
                              </svg>
                              Orders
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              closeProfileMenu();
                              handleLogout();
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm w-full text-left"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/ecommerce/login"
                            state={{ mode: "login" }}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                            onClick={closeProfileMenu}
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/ecommerce/login"
                            state={{ mode: "register" }}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                            onClick={closeProfileMenu}
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                className="md:hidden text-white"
                onClick={toggleMobileMenu}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          {/* MOBILE SEARCH */}
          <div className="px-4 py-4 flex items-center gap-2 bg-white/10">
            <img src={svgSearch} alt="Search" className="w-4 h-4 text-white" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* MOBILE NAVIGATION */}
          <ul className="px-4 py-4 space-y-3">
            <li>
              <Link
                to="/company"
                className="block text-white text-sm font-semibold tracking-wider py-2"
                onClick={toggleMobileMenu}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/company/about"
                className="block text-white text-sm font-semibold tracking-wider py-2"
                onClick={toggleMobileMenu}
              >
                ABOUT US
              </Link>
            </li>
            <li>
              <Link
                to="/company/products"
                className="block text-white text-sm font-semibold tracking-wider py-2"
                onClick={toggleMobileMenu}
              >
                PRODUCTS
              </Link>
            </li>
            <li>
              <Link
                to="/company/contact"
                className="block text-white text-sm font-semibold tracking-wider py-2"
                onClick={toggleMobileMenu}
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
