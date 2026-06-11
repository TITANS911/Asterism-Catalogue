import { Link, useLocation } from "react-router-dom";
import styles from "../styles/ecommerce/CategoryNav.module.css";

function CategoryNav({ activeCategory = null }) {
  const location = useLocation();
  const isCompanyProductsPreview = location.pathname === "/company/products";

  const navItems = [
    {
      label: "New & Featured",
      to: isCompanyProductsPreview ? "/company/products" : "/ecommerce",
      key: "new",
    },
    { label: "Men", to: "/ecommerce/men", key: "men" },
    { label: "Women", to: "/ecommerce/women", key: "women" },
    { label: "Kids", to: "/ecommerce/kids", key: "kids" },
    { label: "Sale", to: "/ecommerce/sale", key: "sale" },
  ];

  return (
    <nav className={styles.categoryBar} aria-label="Product Categories">
      <ul className={styles.categoryList}>
        {navItems.map((item) => (
          <li key={item.key}>
            <Link
              to={item.to}
              className={`${styles.categoryLink} ${activeCategory === item.key ? styles.activeCategory : ""}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CategoryNav;
