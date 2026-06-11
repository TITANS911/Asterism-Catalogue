import ProductCard from "./ProductCard";
import styles from "../styles/RecentlyViewed.module.css";

function RecentlyViewed({ products = [], onProductClick }) {
  if (products.length === 0) return null;

  return (
    <section className={styles.recentlyViewed}>
      <h2 className={styles.title}>Recently You View</h2>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            size="small"
            variant="sale"
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;
