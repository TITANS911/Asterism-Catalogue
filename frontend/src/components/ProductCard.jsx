import styles from "../styles/ProductCard.module.css";

function ProductCard({ product, size = "default", variant = "default", onClick }) {
  const classNames = [styles.productCard];

  if (size === "small") {
    classNames.push(styles.smallCard);
  }

  if (variant === "sale") {
    classNames.push(styles.saleCard);
  }

  const cardClass = classNames.join(" ");

  return (
    <article className={cardClass} onClick={onClick}>
      <div className={styles.imageWrapper}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span>No Image</span>
        )}
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.description}>{product.desc}</p>
        <div className={styles.priceRow}>
          <p className={styles.price}>{product.price}</p>
          {product.originalPrice && (
            <p className={styles.originalPrice}>{product.originalPrice}</p>
          )}
          {product.discountPercent > 0 && (
            <p className={styles.discountBadge}>{product.discountPercent}%</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
