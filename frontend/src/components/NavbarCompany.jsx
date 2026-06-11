import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/icons/asterism-logo-white.svg";
import svgSearch from "../assets/icons/search-icon.svg";
import profile from "../assets/icons/ecommerce/navbar/profile-white-icon.svg";

import styles from "../styles/company/NavbarCompany.module.css";

export default function NavbarCompany() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah login dan apakah admin
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          // Cek struktur data baru dan lama
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

  // untuk searchbar
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  const isContactPage = location.pathname === "/company/contact";
  const headerStateClass = isContactPage
    ? styles.solidPage
    : scrolled
      ? styles.scrolled
      : styles.transparent;

  return (
    <header className={`${styles.header} ${headerStateClass}`}>
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
          <Link to="/company">
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
            <Link to="/company/products" className={styles.link}>
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

          <div className={styles.iconWrapper}>
            <div className={styles.iconGrid}>
              <button className={`${styles.iconItem} relative`} onClick={toggleProfileMenu}>
                <img src={profile} alt="profile" className={styles.iconImage} />
              </button>
            </div>

            {/* Profile Popup */}
            {isProfileMenuOpen && (
              <div className={styles.profilePopup}>
                {isLoggedIn ? (
                  <>
                    {isAdmin ? (
                      <Link
                        to="/ecommerce/admin/dashboard"
                        className={styles.popupLink}
                        onClick={closeProfileMenu}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/ecommerce/orders"
                        className={styles.popupLink}
                        onClick={closeProfileMenu}
                      >
                        Orders
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        closeProfileMenu();
                        handleLogout();
                      }}
                      className={styles.popupButton}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/ecommerce/login"
                      className={styles.popupLink}
                      onClick={closeProfileMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/ecommerce/login"
                      state={{ mode: "register" }}
                      className={styles.popupLink}
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
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
