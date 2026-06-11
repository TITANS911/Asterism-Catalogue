import { Link } from "react-router-dom";

import logoBlack from "../assets/icons/asterism-logo-black.svg";
import logoWhite from "../assets/icons/asterism-logo-white.svg";

import chatWhite from "../assets/icons/icon-chat-white.svg";
import callWhite from "../assets/icons/icon-phone-white.svg";
import shopWhite from "../assets/icons/icon-shop-white.svg";

import gmailWhite from "../assets/icons/icon-gmail-white.svg";
import twitterWhite from "../assets/icons/icon-twitter-white.svg";
import instagramWhite from "../assets/icons/icon-ig-white.svg";
import facebookWhite from "../assets/icons/icon-facebook-white.svg";


import chatBlack from "../assets/icons/icon-chat-black.svg";
import callBlack from "../assets/icons/icon-phone-black.svg";
import shopBlack from "../assets/icons/icon-shop-black.svg";

import gmailBlack from "../assets/icons/icon-gmail-black.svg";
import twitterBlack from "../assets/icons/icon-twitter-black.svg";
import instagramBlack from "../assets/icons/icon-ig-black.svg";
import facebookBlack from "../assets/icons/icon-facebook-black.svg";

import styles from "../styles/Footer.module.css";

export default function Footer({ isEcommerce = true }) {
  const handleNavigation = () => {
    window.scrollTo(0, 0);
  };

  // Theme
  // false = white (company)
  // true = black (ecommerce), default

  return (
    <footer
      className={`
        ${styles.footer}
        ${isEcommerce ? styles.themeEcommerce : styles.themeCompany}
      `}
    >
      <div className={styles.container}>

        {/* Brand */}
        <div className={styles.brand}>
          <img
            src={isEcommerce ? logoWhite : logoBlack}
            alt="ASTERISM Logo"
            className={styles.logo}
          />

          <p className={styles.tagline}>
            Beyond The Infinity
          </p>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link to="/company" onClick={handleNavigation}>
              Home
          </Link>
          <Link to="/company/about" onClick={handleNavigation}>
            About
          </Link>
          <Link to="/company/products" onClick={handleNavigation}>
            Products
          </Link>
          <Link  to="/company#faq"
            onClick={() => {
              setTimeout(() => {
                const faqSection = document.getElementById("faq");

                if (faqSection) {
                  faqSection.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }, 100);
            }}
          >FAQ</Link>
          <Link to="/company/contact" onClick={handleNavigation}>Contact</Link>
          <Link to="/size-chart">Size Chart</Link>
        </nav>

        {/* Contact */}
        <section className={styles.contactSection}>
          <h3 className={styles.contactTitle}>
            Contact Us
          </h3>

          <div className={styles.contactGrid}>

            {/* Chat */}
            <div className={styles.contactCard}>

              <div className={styles.iconBox}>
                <img
                  src={isEcommerce ? chatWhite : chatBlack}
                  alt="Chat Icon"
                  className={styles.icon}
                />
              </div>

              <h4 className={styles.cardTitle}>
                Chat With Us
              </h4>
              <div className={styles.cardInfo}>
                  
                <p className={styles.cardText}>
                  Products & Orders
                </p>

                <p className={styles.cardText}>
                  4am - 11pm WIB
                </p>

                <p className={styles.cardText}>
                  5 days a week
                </p>
              </div>
            </div>

            {/* Call */}
            <div className={styles.contactCard}>
              <div className={styles.iconBox}>
                <img
                  src={isEcommerce ? callWhite : callBlack}
                  alt="Call Icon"
                  className={styles.icon}
                />
              </div>

              <h4 className={styles.cardTitle}>
                Call Us
              </h4>

              {/* Text Wrapper */}
              <div className={styles.cardInfo}>
                <p className={styles.cardText}>
                  Products & Orders
                </p>

                <p className={styles.cardText}>
                  4am - 11pm WIB
                </p>

                <p className={styles.cardText}>
                  5 days a week
                </p>
              </div>

            </div>

            {/* For Store */}
            <div className={styles.contactCard}>

              <div className={styles.iconBox}>
                <img
                  src={isEcommerce ? shopWhite : shopBlack}
                  alt="Store Icon"
                  className={styles.icon}
                />
              </div>
            
              <div className={styles.cardInfo}>
                <h4 className={styles.cardTitle}>
                  Find a Store
                </h4>

                <p className={styles.cardText}>
                  asterism.idn
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Social Media */}
        <section className={styles.socialSection}>

          <h3 className={styles.socialTitle}>
            Social Media
          </h3>

          <div className={styles.socialList}>

            <div className={styles.socialItem}>
              <img
                src={isEcommerce ? gmailWhite : gmailBlack}
                alt="gmail"
                className={styles.socialIcon}
              />

              <p>asterismsupport@gmail.com</p>
            </div>

            <div className={styles.socialItem}>
              <img
                src={isEcommerce ? twitterWhite : twitterBlack}
                alt="twitter"
                className={styles.socialIcon}
              />
              <p>asterism.idn</p>
            </div>

            <div className={styles.socialItem}>
              <img
                src={isEcommerce ? instagramWhite : instagramBlack}
                alt="instagram"
                className={styles.socialIcon}
              />

              <p>asterism.idn</p>
            </div>

            <div className={styles.socialItem}>
              <img
                src={isEcommerce ? facebookWhite : facebookBlack}
                alt="facebook"
                className={styles.socialIcon}
              />

              <p>asterism.idn</p>
            </div>

          </div>

        </section>

        {/* Bottom */}
        <div className={styles.bottomFooter}>

          <p>©2026 Asterism.idn</p>

          <div className={styles.bottomLinks}>
            <p>All Right Reserved</p>
            <p>Terms of Sale</p>
            <p>Terms of Use</p>
            <p>Asterism Privacy Policy</p>
          </div>

        </div>

      </div>
    </footer>
  );
}