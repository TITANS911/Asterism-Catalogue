export const API_URL = "http://localhost:3001/api";
export const API_BASE = "http://localhost:3001";

export function getProductImageUrl(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  const src = product.image || product.featured_image || images[0];

  if (!src) return null;
  if (
    src.startsWith("http") ||
    src.startsWith("data:") ||
    src.startsWith("/src") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  return `${API_BASE}${src.startsWith("/") ? src : `/${src}`}`;
}

export function formatRupiah(amount) {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (Number.isNaN(num)) return "Rp0";
  return `Rp${Math.round(num).toLocaleString("id-ID")}`;
}

export function calculateDiscountPercent(price, discountPrice) {
  const original = parseFloat(price);
  const discounted = parseFloat(discountPrice);

  if (!original || !discounted || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export function isOnSale(product) {
  const price = parseFloat(product.price);
  const discountPrice = parseFloat(product.discount_price);

  return (
    product.discount_price != null &&
    !Number.isNaN(discountPrice) &&
    discountPrice > 0 &&
    discountPrice < price
  );
}

export function mapApiProductToCard(product) {
  const onSale = isOnSale(product);
  const salePrice = onSale ? product.discount_price : product.price;

  return {
    id: product.id,
    name: product.name,
    desc: product.short_description || product.description || "",
    price: formatRupiah(salePrice),
    originalPrice: onSale ? formatRupiah(product.price) : null,
    discountPercent: onSale
      ? calculateDiscountPercent(product.price, product.discount_price)
      : null,
    priceValue: parseFloat(salePrice),
    image: getProductImageUrl(product),
    variants: product.variants || [],
  };
}

export async function fetchActiveCategories() {
  const response = await fetch(`${API_URL}/products/categories`);
  const result = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    return [];
  }

  return result.data
    .filter((category) => !category.parent_id && category.status !== "inactive")
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}
