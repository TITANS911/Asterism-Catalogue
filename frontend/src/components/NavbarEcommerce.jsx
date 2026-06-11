import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/icons/asterism-logo-white.svg";
import svgSearch from "../assets/icons/search-icon.svg";
import like from "../assets/icons/ecommerce/navbar/like-white-icon.svg";
import shop from "../assets/icons/ecommerce/navbar/shop-white-icon.svg";
import profile from "../assets/icons/ecommerce/navbar/profile-white-icon.svg";

import styles from "../styles/Ecommerce/NavbarEcommerce.module.css";

export default function NavbarEcommerce() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setCartCount(cart.length);
      setWishlistCount(favorites.length);
    };

    updateCounts();
    // Tambahkan event listener untuk memantau perubahan localStorage
    window.addEventListener("storage", updateCounts);
    // Karena 'storage' event hanya terpicu antar tab, kita buat interval singkat atau gunakan event custom
    const interval = setInterval(updateCounts, 1000);

    return () => {
      window.removeEventListener("storage", updateCounts);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Cek apakah user adalah admin
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Cek struktur data baru dan lama
        const email = userData.email || (userData.user && userData.user.email);
        const userGroupId =
          userData.user_group_id ||
          (userData.user && userData.user.user_group_id);
        setIsAdmin(email === "admin@asterism.com" || userGroupId === 1);
      } catch (e) {
        setIsAdmin(false);
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
    navigate("/");
  };

  // untuk searchbar
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const isTransparentRoute = location.pathname === "/ecommerce";

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${query}`);
    }
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

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
    <header
      className={`${styles.header} ${
        scrolled || !isTransparentRoute ? styles.scrolled : styles.transparent
      }`}
    >
      {/* TOP BAR */}
      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <p className={styles.topText}>
            Need Help? Contact Us | 0812-3456-7890
          </p>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={styles.navbar}>
        {/* LOGO */}
        <div className={styles.logoContainer}>
          <Link to="/ecommerce">
            <img src={logo} alt="Logo" className={styles.logoImage} />
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <ul className={`${styles.navLinks} ${styles.desktopOnly}`}>
          <li>
            <Link to="/company" className={styles.link}>
              HOME
            </Link>
          </li>

          <li>
            <Link to="/company/about" className={styles.link}>
              ABOUT US
            </Link>
          </li>

          <li>
            <Link to="/ecommerce" className={styles.link}>
              PRODUCTS
            </Link>
          </li>

          <li>
            <Link to="/company/contact" className={styles.link}>
              CONTACT
            </Link>
          </li>
        </ul>

        {/* DESKTOP SEARCH */}
        <div className={`${styles.rightSection} ${styles.desktopOnly}`}>
          <div className={`${styles.searchBar} ${styles.desktopOnly}`}>
            <img src={svgSearch} alt="Search" className={styles.searchIcon} />

            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className={`${styles.iconWrapper} relative`}>
            <div className={styles.iconGrid}>
              <Link to="/ecommerce/favorites" className={`${styles.iconItem} relative`}>
                <img src={like} alt="favorite" className={styles.iconImage} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/ecommerce/bag" className={`${styles.iconItem} relative`}>
                <img src={shop} alt="shop" className={styles.iconImage} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button className={`${styles.iconItem} relative`} onClick={toggleProfileMenu}>
                <img src={profile} alt="profile" className={styles.iconImage} />
              </button>
            </div>

            {/* Profile Popup */}
            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                {isAdmin && (
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
                )}

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
                  My Order
                </Link>

                <button
                  onClick={() => {
                    closeProfileMenu();
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm w-full"
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
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className={`${styles.mobileMenuButton} ${styles.mobileOnly}`}
          onClick={toggleMobileMenu}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {/* MOBILE SEARCH */}
          <div className={styles.searchBarMobile}>
            <img src={svgSearch} alt="Search" className={styles.searchIcon} />

            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
            />
          </div>

          {/* MOBILE NAVIGATION */}
          <ul className={styles.navLinksMobile}>
            <li>
              <Link
                to="/company"
                className={styles.linkMobile}
                onClick={toggleMobileMenu}
              >
                HOME
              </Link>
            </li>

            <li>
              <Link
                to="/company/about"
                className={styles.linkMobile}
                onClick={toggleMobileMenu}
              >
                ABOUT US
              </Link>
            </li>

            <li>
              <Link
                to="/company/products"
                className={styles.linkMobile}
                onClick={toggleMobileMenu}
              >
                PRODUCTS
              </Link>
            </li>

            <li>
              <Link
                to="/company/contact"
                className={styles.linkMobile}
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
